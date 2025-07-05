import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  customer: {
    name: {
      type: String,
      required: [true, 'Please provide customer name'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Please provide customer email'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Please provide customer phone'],
      trim: true
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: {
        type: String,
        default: 'India'
      }
    }
  },
  painting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Painting',
    required: [true, 'Please provide painting reference']
  },
  paintingDetails: {
    title: String,
    artist: String,
    price: Number,
    image: String,
    category: String,
    categoryName: String,
    medium: String,
    dimensions: String
  },
  status: {
    type: String,
    enum: ['new', 'pending', 'completed', 'rejected'],
    default: 'new'
  },
  totalAmount: {
    type: Number,
    required: [true, 'Please provide total amount']
  },
  paymentMethod: {
    type: String,
    enum: ['cash_on_delivery', 'bank_transfer', 'online_payment'],
    default: 'cash_on_delivery'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  estimatedDelivery: {
    type: Date
  },
  actualDelivery: {
    type: Date
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  adminNotes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
orderSchema.index({ 'customer.email': 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

// Virtual for order number
orderSchema.virtual('orderNumber').get(function() {
  return `KA${this._id.toString().slice(-6).toUpperCase()}`;
});

// Virtual for status color
orderSchema.virtual('statusColor').get(function() {
  const colors = {
    new: 'blue',
    pending: 'yellow',
    completed: 'green',
    rejected: 'red'
  };
  return colors[this.status] || 'gray';
});

// Virtual for formatted amount
orderSchema.virtual('formattedAmount').get(function() {
  return `₹${this.totalAmount.toLocaleString('en-IN')}`;
});

// Ensure virtuals are included in JSON
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

// Populate painting details when saving
orderSchema.pre('save', async function(next) {
  if (this.isModified('painting') && this.painting) {
    try {
      const Painting = mongoose.model('Painting');
      const painting = await Painting.findById(this.painting);
      if (painting) {
        this.paintingDetails = {
          title: painting.title,
          artist: painting.artist,
          price: painting.price,
          image: painting.image
        };
      }
    } catch (error) {
      console.error('Error populating painting details:', error);
    }
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order; 