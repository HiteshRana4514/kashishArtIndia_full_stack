import nodemailer from 'nodemailer';

/**
 * Email service using Nodemailer
 * Configured to work with Gmail SMTP (free option)
 */
class EmailService {
  constructor() {
    try {
      // Hardcoded settings for Hostinger SMTP - more reliable than env vars
      const host = 'smtp.hostinger.com';
      const port = 465;
      const user = 'info@kashishartindia.com';
      const pass = 'Kashishartindia@123';
      
      console.log('Initializing email transporter with hardcoded settings:', {
        host: host,
        port: port,
        secure: true,
        user: user,
        hasPassword: !!pass
      });
      
      this.transporter = nodemailer.createTransport({
        host: host,
        port: port,
        secure: true, // true for port 465
        auth: {
          user: user,
          pass: pass
        },
        debug: true, // Show debug output
        logger: true // Log information into console
      });
      
      // Verify connection configuration
      this.transporter.verify((error, success) => {
        if (error) {
          console.error('Email transporter verification failed:', error);
        } else {
          console.log('Email server is ready to send messages:', success);
        }
      });
    } catch (error) {
      console.error('Failed to initialize email transporter:', error);
    }
  }

  /**
   * Send an email
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email
   * @param {string} options.subject - Email subject
   * @param {string} options.text - Plain text email body
   * @param {string} options.html - HTML email body (optional)
   * @returns {Promise} - Email sending result
   */
  async sendEmail(options) {
    try {
      if (!this.transporter) {
        console.error('Email transporter not initialized');
        return {
          success: false,
          error: 'Email transporter not initialized'
        };
      }

      // Hardcoded from name and email for consistency
      const fromName = 'Kashish Art India';
      const fromEmail = 'info@kashishartindia.com';
      
      if (!fromEmail) {
        console.error('Missing FROM email address');
        return {
          success: false,
          error: 'Missing FROM email configuration'
        };
      }
      
      if (!options.to) {
        console.error('Missing recipient email address');
        return {
          success: false,
          error: 'Missing recipient email'
        };
      }
      
      console.log(`Attempting to send email to: ${options.to}`);
      
      const mailOptions = {
        from: `${fromName} <${fromEmail}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html || undefined
      };

      console.log('Mail options:', {
        from: mailOptions.from,
        to: mailOptions.to,
        subject: mailOptions.subject
      });

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info);
      return {
        success: true,
        messageId: info.messageId,
        info: info
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }
  }

  /**
   * Send order confirmation email
   * @param {Object} order - Order details
   * @param {Object} customer - Customer details
   * @returns {Promise}
   */
  async sendOrderConfirmation(order, customer) {
    const subject = `Order Inquiry Received - Kashish Art India`;
    
    const text = `
      Dear ${customer.name},
      
      Thank you for your interest in our artwork!
      
      We have received your inquiry for the painting "${order.paintingName}".
      
      Your inquiry details:
      - Order Reference: ${order._id}
      - Painting: ${order.paintingName}
      - Status: ${order.status}
      
      We will review your request and get back to you soon.
      
      Best regards,
      Kashish Art India Team
    `;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #b45309;">Thank You for Your Interest!</h2>
        <p>Dear ${customer.name},</p>
        <p>We have received your inquiry for the painting <strong>"${order.paintingName}"</strong>.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Inquiry Details</h3>
          <p><strong>Order Reference:</strong> ${order._id}</p>
          <p><strong>Painting:</strong> ${order.paintingName}</p>
          <p><strong>Status:</strong> <span style="color: #b45309;">${order.status}</span></p>
        </div>
        
        <p>We will review your request and contact you shortly to discuss the next steps.</p>
        
        <p>Best regards,<br>Kashish Art India Team</p>
      </div>
    `;
    
    return this.sendEmail({
      to: customer.email,
      subject,
      text,
      html
    });
  }

  /**
   * Send contact form email
   * @param {Object} contactData - Contact form data
   * @returns {Promise}
   */
  async sendContactFormEmail(contactData) {
    const subject = `New Contact Form Submission - ${contactData.subject}`;
    
    const text = `
      New contact form submission:
      
      Name: ${contactData.name}
      Email: ${contactData.email}
      Subject: ${contactData.subject}
      
      Message:
      ${contactData.message}
    `;
    
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #b45309;">New Contact Form Submission</h2>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Subject:</strong> ${contactData.subject}</p>
          <p><strong>Message:</strong></p>
          <p style="background-color: white; padding: 10px; border-left: 4px solid #b45309;">
            ${contactData.message.replace(/\n/g, '<br>')}
          </p>
        </div>
      </div>
    `;
    
    // Email to admin
    return this.sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject,
      text,
      html: adminHtml
    });
  }

  /**
   * Send order status update notification
   * @param {Object} order - Order details
   * @param {string} newStatus - New order status
   * @returns {Promise}
   */
  async sendOrderStatusUpdate(order, newStatus) {
    const subject = `Order Status Update - Kashish Art India`;
    
    const text = `
      Dear ${order.customerName},
      
      Your order inquiry status has been updated:
      
      - Order Reference: ${order._id}
      - Painting: ${order.paintingName}
      - Previous Status: ${order.status}
      - New Status: ${newStatus}
      
      ${this._getStatusMessage(newStatus)}
      
      Best regards,
      Kashish Art India Team
    `;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #b45309;">Order Status Update</h2>
        <p>Dear ${order.customerName},</p>
        <p>Your order inquiry status has been updated:</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Order Reference:</strong> ${order._id}</p>
          <p><strong>Painting:</strong> ${order.paintingName}</p>
          <p><strong>Previous Status:</strong> ${order.status}</p>
          <p><strong>New Status:</strong> <span style="color: ${this._getStatusColor(newStatus)};">${newStatus}</span></p>
        </div>
        
        <p>${this._getStatusMessage(newStatus)}</p>
        
        <p>Best regards,<br>Kashish Art India Team</p>
      </div>
    `;
    
    return this.sendEmail({
      to: order.customerEmail,
      subject,
      text,
      html
    });
  }

  /**
   * Get appropriate message based on order status
   * @private
   */
  _getStatusMessage(status) {
    switch(status.toLowerCase()) {
      case 'completed':
        return 'Congratulations! Your order has been completed. We will be shipping your artwork soon.';
      case 'pending':
        return 'Your order is now being processed. We will contact you shortly with payment details.';
      case 'rejected':
        return 'Unfortunately, we are unable to fulfill this order at this time. Please contact us for more information.';
      default:
        return 'Please contact us if you have any questions about your order.';
    }
  }

  /**
   * Get appropriate color for status display
   * @private
   */
  _getStatusColor(status) {
    switch(status.toLowerCase()) {
      case 'completed': return '#059669'; // green
      case 'pending': return '#d97706'; // amber
      case 'rejected': return '#dc2626'; // red
      default: return '#2563eb'; // blue
    }
  }
}

export default new EmailService();
