import mongoose from 'mongoose';

const paintingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  artist: {
    type: String,
    required: false,
    trim: true,
    maxlength: [50, 'Artist name cannot be more than 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    trim: true,
    default: 'Landscape'
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  images: {
    type: [String],
    required: [true, 'Please provide at least one image']
  },
  size: {
    type: String,
    required: false
  },
  medium: {
    type: String,
    required: false,
    trim: true
  },
  year: {
    type: Number,
    required: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index for search functionality
paintingSchema.index({ 
  title: 'text', 
  description: 'text', 
  artist: 'text',
  category: 'text'
});

// Virtual for formatted price
paintingSchema.virtual('formattedPrice').get(function() {
  return `₹${this.price.toLocaleString('en-IN')}`;
});

// Virtual for dimensions string
paintingSchema.virtual('dimensionsString').get(function() {
  return this.size || 'Dimensions not specified';
});

// Ensure virtuals are included in JSON
paintingSchema.set('toJSON', { virtuals: true });
paintingSchema.set('toObject', { virtuals: true });

const Painting = mongoose.model('Painting', paintingSchema);

export default Painting; 