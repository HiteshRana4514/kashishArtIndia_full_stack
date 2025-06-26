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
    required: [true, 'Please provide an artist name'],
    trim: true,
    maxlength: [50, 'Artist name cannot be more than 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Landscape', 'Portrait', 'Abstract', 'Still Life', 'Modern', 'Traditional'],
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
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  dimensions: {
    width: {
      type: Number,
      required: [true, 'Please provide width']
    },
    height: {
      type: Number,
      required: [true, 'Please provide height']
    },
    unit: {
      type: String,
      enum: ['cm', 'inches'],
      default: 'cm'
    }
  },
  medium: {
    type: String,
    required: [true, 'Please provide the medium'],
    enum: ['Oil', 'Acrylic', 'Watercolor', 'Gouache', 'Mixed Media', 'Digital'],
    default: 'Oil'
  },
  year: {
    type: Number,
    required: [true, 'Please provide the year'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
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
  return `${this.dimensions.width} × ${this.dimensions.height} ${this.dimensions.unit}`;
});

// Ensure virtuals are included in JSON
paintingSchema.set('toJSON', { virtuals: true });
paintingSchema.set('toObject', { virtuals: true });

const Painting = mongoose.model('Painting', paintingSchema);

export default Painting; 