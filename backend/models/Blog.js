import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Please add blog content']
  },
  summary: {
    type: String,
    required: [true, 'Please add a summary'],
    maxlength: [500, 'Summary cannot be more than 500 characters']
  },
  coverImage: {
    type: String,
    default: 'default-blog.jpg'
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  readTime: {
    type: Number,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create slug from title
BlogSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  // Calculate approximate read time based on content length
  if (this.isModified('content')) {
    const wordCount = this.content.split(/\s+/).length;
    // Average reading speed is about 200-250 words per minute
    this.readTime = Math.ceil(wordCount / 200);
  }
  
  next();
});

// Virtual for url
BlogSchema.virtual('url').get(function() {
  return `/blog/${this.slug}`;
});

const Blog = mongoose.model('Blog', BlogSchema);

export default Blog;
