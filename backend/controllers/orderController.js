import Order from '../models/Order.js';
import Painting from '../models/Painting.js';
import asyncHandler from 'express-async-handler';
import emailService from '../utils/emailService.js';

// @desc    Create new order from client purchase inquiry
// @route   POST /api/orders
// @access  Public
export const createOrder = asyncHandler(async (req, res) => {
  const { customer, paintingId, paintingDetails, message, totalAmount } = req.body;

  // Check if we have the paintingDetails directly from the client (preferred)
  // or if we need to fetch them from the database
  let usePaintingDetails = paintingDetails;
  let fetchedPainting = null;

  // Validate required fields
  if (!customer?.name || !customer?.email || !customer?.phone || !paintingId) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  try {
    // Find the painting to verify it exists and is available
    fetchedPainting = await Painting.findById(paintingId);
    if (!fetchedPainting) {
      res.status(404);
      throw new Error('Painting not found');
    }

    // Note: We're not automatically checking availability to allow admin manual control
    // Just log if painting is marked as unavailable but still allow the order
    if (!fetchedPainting.isAvailable) {
      console.log(`Notice: Order created for painting ${paintingId} which is marked as unavailable`);
    }

    // If we didn't get full painting details from the client,
    // construct them from the database
    if (!usePaintingDetails || Object.keys(usePaintingDetails).length === 0) {
      usePaintingDetails = {
        title: fetchedPainting.title,
        artist: fetchedPainting.artist || 'Kashish Art India',
        price: fetchedPainting.price,
        image: fetchedPainting.image,
        category: fetchedPainting.category || '',
        categoryName: fetchedPainting.categoryName || fetchedPainting.category || '',
        medium: fetchedPainting.medium || '',
        dimensions: fetchedPainting.dimensions || fetchedPainting.size || ''
      };
    } else {
      // Make sure to include any missing fields from the database
      usePaintingDetails = {
        ...usePaintingDetails,
        artist: usePaintingDetails.artist || fetchedPainting.artist || 'Kashish Art India',
        category: usePaintingDetails.category || fetchedPainting.category || '',
        categoryName: usePaintingDetails.categoryName || fetchedPainting.categoryName || fetchedPainting.category || '',
        medium: usePaintingDetails.medium || fetchedPainting.medium || '',
        dimensions: usePaintingDetails.dimensions || fetchedPainting.dimensions || fetchedPainting.size || ''
      };
    }

    // Ensure address is structured properly
    const address = customer.address || {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    };

    // Create new order
    const order = new Order({
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: address
      },
      painting: paintingId,
      paintingDetails: usePaintingDetails,
      totalAmount: totalAmount || fetchedPainting.price,
      message: message || '',
      status: 'new' // Starting with 'new' status for admin review
    });

    const createdOrder = await order.save();
    
    // Send email notifications
    try {
      console.log('Attempting to send order confirmation emails');
      console.log('Customer email:', customer.email);
      console.log('Admin email:', process.env.ADMIN_EMAIL);
      
      // Check if environment variables are loaded
      console.log('Email config check:', {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        username: process.env.EMAIL_USERNAME,
        from: process.env.EMAIL_FROM,
        fromName: process.env.EMAIL_FROM_NAME,
        adminEmail: process.env.ADMIN_EMAIL
      });
      
      // Send confirmation email to customer
      const customerEmailResult = await emailService.sendOrderConfirmation(
        {
          _id: createdOrder._id,
          paintingName: usePaintingDetails.title,
          status: 'new'
        },
        {
          name: customer.name,
          email: customer.email
        }
      );
      
      console.log('Customer email result:', customerEmailResult);
      
      // Send notification to admin
      const adminEmailResult = await emailService.sendEmail({
        to: 'info@kashishartindia.com', // Hardcoded admin email
        subject: `New Order Inquiry - ${usePaintingDetails.title}`,
        text: `
          New order received:
          
          Order ID: ${createdOrder._id}
          Painting: ${usePaintingDetails.title}
          Customer: ${customer.name}
          Email: ${customer.email}
          Phone: ${customer.phone}
          Message: ${message || 'None'}
          Price: ₹${totalAmount || fetchedPainting.price}
          
          Please log in to the admin panel to manage this order.
        `,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #b45309;">New Order Received</h2>
            
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${createdOrder._id}</p>
              <p><strong>Painting:</strong> ${usePaintingDetails.title}</p>
              <p><strong>Price:</strong> ₹${totalAmount || fetchedPainting.price}</p>
              <p><strong>Status:</strong> New</p>
            </div>
            
            <h3 style="color: #1f2937;">Customer Information</h3>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Name:</strong> ${customer.name}</p>
              <p><strong>Email:</strong> ${customer.email}</p>
              <p><strong>Phone:</strong> ${customer.phone}</p>
              <p><strong>Address:</strong> ${customer.address ? `${customer.address.street}, ${customer.address.city}, ${customer.address.state}, ${customer.address.zipCode}, ${customer.address.country}` : 'Not provided'}</p>
            </div>
            
            ${message ? `
              <h3 style="color: #1f2937;">Customer Message</h3>
              <p style="background-color: white; padding: 10px; border-left: 4px solid #b45309;">
                ${message.replace(/\n/g, '<br>')}
              </p>
            ` : ''}
            
            <p>Please <a href="http://localhost:3000/admin/orders" style="color: #b45309;">log in to the admin panel</a> to manage this order.</p>
          </div>
        `
      });
      
      console.log('Admin email result:', adminEmailResult);
      console.log('Order notification emails sent successfully');
    } catch (emailError) {
      // Don't fail the order creation if email sending fails
      console.error('Failed to send order notification emails:', emailError);
    }
    
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = asyncHandler(async (req, res) => {
  try {
    // Get all orders sorted by creation date (newest first)
    const orders = await Order.find({})
      .populate('painting')
      .sort({ createdAt: -1 });
    
    // Enhance orders with complete painting details
    const enhancedOrders = await Promise.all(orders.map(async (order) => {
      // Convert to plain object so we can modify it
      const orderObj = order.toObject();
      
      // If we have a painting reference, ensure paintingDetails is complete
      if (orderObj.painting) {
        // Get the populated painting document
        const paintingDoc = orderObj.painting;
        
        // Ensure paintingDetails exists
        if (!orderObj.paintingDetails) {
          orderObj.paintingDetails = {};
        }
        
        // Complete any missing details from the painting document
        orderObj.paintingDetails = {
          ...orderObj.paintingDetails,
          title: orderObj.paintingDetails.title || paintingDoc.title || '',
          category: orderObj.paintingDetails.category || paintingDoc.category || '',
          categoryName: orderObj.paintingDetails.categoryName || paintingDoc.categoryName || paintingDoc.category || '',
          dimensions: orderObj.paintingDetails.dimensions || paintingDoc.dimensions || paintingDoc.size || '',
          medium: orderObj.paintingDetails.medium || paintingDoc.medium || '',
          price: orderObj.paintingDetails.price || paintingDoc.price || 0,
          image: orderObj.paintingDetails.image || paintingDoc.image || ''
        };
      }
      
      return orderObj;
    }));
    
    res.json({ orders: enhancedOrders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private/Admin
export const getOrderById = asyncHandler(async (req, res) => {
  try {
    // Find the order by ID and populate the painting reference
    const order = await Order.findById(req.params.id).populate('painting');
    
    if (order) {
      // Convert to plain object so we can modify it
      const orderObj = order.toObject();
      
      // If we have a painting reference, ensure paintingDetails is complete
      if (orderObj.painting) {
        // Get the populated painting document
        const paintingDoc = orderObj.painting;
        
        // Ensure paintingDetails exists
        if (!orderObj.paintingDetails) {
          orderObj.paintingDetails = {};
        }
        
        // Complete any missing details from the painting document
        orderObj.paintingDetails = {
          ...orderObj.paintingDetails,
          title: orderObj.paintingDetails.title || paintingDoc.title || '',
          category: orderObj.paintingDetails.category || paintingDoc.category || '',
          categoryName: orderObj.paintingDetails.categoryName || paintingDoc.categoryName || paintingDoc.category || '',
          dimensions: orderObj.paintingDetails.dimensions || paintingDoc.dimensions || paintingDoc.size || '',
          medium: orderObj.paintingDetails.medium || paintingDoc.medium || '',
          price: orderObj.paintingDetails.price || paintingDoc.price || 0,
          image: orderObj.paintingDetails.image || paintingDoc.image || ''
        };
      }
      
      res.json(orderObj);
    } else {
      res.status(404);
      throw new Error('Order not found');
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(404).json({ message: 'Order not found', error: error.message });
  }
});

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  
  if (!status) {
    res.status(400);
    throw new Error('Status is required');
  }

  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    
    // Valid statuses
    const validStatuses = ['new', 'pending', 'completed', 'rejected'];
    
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error('Invalid status value');
    }
    
    // Store previous status for email notification
    const previousStatus = order.status;
    
    // Update status
    order.status = status;
    
    // We've removed automatic painting availability updates
    // Admin will manually manage painting availability status
    
    const updatedOrder = await order.save();
    
    // Send email notification to customer about status change
    try {
      // Get customer email from order
      const customerEmail = order.customer?.email;
      const customerName = order.customer?.name;
      
      if (customerEmail) {
        // Send status update notification
        await emailService.sendOrderStatusUpdate(
          {
            _id: order._id,
            paintingName: order.paintingDetails?.title || 'Your painting',
            customerName: customerName || 'Valued Customer',
            customerEmail: customerEmail,
            status: previousStatus
          },
          status
        );
        
        console.log(`Order status update email sent to ${customerEmail}`);
      }
    } catch (emailError) {
      // Don't fail the order update if email sending fails
      console.error('Failed to send order status update email:', emailError);
    }
    
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
});

// @desc    Update order details
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrder = asyncHandler(async (req, res) => {
  const { 
    customer, 
    status, 
    totalAmount,
    paymentStatus,
    paymentMethod,
    notes,
    adminNotes,
    trackingNumber,
    estimatedDelivery
  } = req.body;

  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    
    // Update customer information if provided
    if (customer) {
      order.customer.name = customer.name || order.customer.name;
      order.customer.email = customer.email || order.customer.email;
      order.customer.phone = customer.phone || order.customer.phone;
      
      if (customer.address) {
        order.customer.address.street = customer.address.street || order.customer.address.street;
        order.customer.address.city = customer.address.city || order.customer.address.city;
        order.customer.address.state = customer.address.state || order.customer.address.state;
        order.customer.address.zipCode = customer.address.zipCode || order.customer.address.zipCode;
        order.customer.address.country = customer.address.country || order.customer.address.country;
      }
    }
    
    // Update order details if provided
    if (status) order.status = status;
    if (totalAmount) order.totalAmount = totalAmount;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (paymentMethod) order.paymentMethod = paymentMethod;
    if (notes) order.notes = notes;
    if (adminNotes) order.adminNotes = adminNotes;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery = new Date(estimatedDelivery);
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Failed to update order', error: error.message });
  }
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }
    
    await order.remove();
    res.json({ message: 'Order removed' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Failed to delete order', error: error.message });
  }
});
