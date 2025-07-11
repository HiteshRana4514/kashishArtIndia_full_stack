import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  excerpt: {
    type: String,
    required: [true, 'Please provide an excerpt'],
    trim: true,
    maxlength: [300, 'Excerpt cannot be more than 300 characters']
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Please provide an author name'],
    trim: true,
    maxlength: [50, 'Author name cannot be more than 50 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Techniques', 'Art History', 'Artist Spotlight', 'Tutorials', 'News', 'Inspiration'],
    default: 'Techniques'
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL']
  },
  tags: [{
    type: String,
    trim: true
  }],
  isPublished: {
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
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    comment: {
      type: String,
      required: true,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  slug: {
    type: String,
    unique: true,
    lowercase: true
  }
}, {
  timestamps: true
});

// Generate slug before saving
blogPostSchema.pre('save', function(next) {
  if (!this.isModified('title')) {
    return next();
  }
  
  this.slug = encodeURIComponent(
    this.title
      .trim()
      .replace(/\s+/g, '-') // replace spaces with dashes
  );
  next();
});

// Index for search functionality
blogPostSchema.index({ 
  title: 'text', 
  content: 'text', 
  excerpt: 'text',
  author: 'text',
  category: 'text'
});

// Virtual for reading time (assuming 200 words per minute)
blogPostSchema.virtual('readingTime').get(function() {
  const wordCount = this.content.split(' ').length;
  const readingTime = Math.ceil(wordCount / 200);
  return readingTime;
});

// Virtual for formatted date
blogPostSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Ensure virtuals are included in JSON
blogPostSchema.set('toJSON', { virtuals: true });
blogPostSchema.set('toObject', { virtuals: true });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost; 