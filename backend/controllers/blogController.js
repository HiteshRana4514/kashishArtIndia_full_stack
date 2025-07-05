import Blog from '../models/Blog.js';
import { fileUpload } from '../utils/fileUpload.js';

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private (Admin only)
export const createBlog = async (req, res) => {
  try {
    const { title, content, summary, tags, isPublished } = req.body;
    let coverImage = null;

    // Handle file upload if present
    if (req.files && req.files.coverImage) {
      const uploadResult = await fileUpload(req.files.coverImage, 'blogs');
      if (!uploadResult.success) {
        return res.status(400).json({ success: false, message: uploadResult.message });
      }
      coverImage = uploadResult.fileName;
    }
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Create blog with the logged-in user as author
    const blog = await Blog.create({
      title,
      slug, // Explicitly set the slug
      content,
      summary,
      coverImage,
      tags: tags ? JSON.parse(tags) : [],
      isPublished: isPublished === 'true',
      author: req.user.id
    });

    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all blog posts
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    let query = {};
    
    console.log('Auth Debug - req.headers:', req.headers);
    console.log('Auth Debug - req.user:', req.user);
    
    // For public access, only show published blogs
    if (!req.user || req.user.role !== 'admin') {
      console.log('Auth Debug - Applying published filter');
      query.isPublished = true;
    } else {
      console.log('Auth Debug - Admin user, showing all blogs');
    }
    
    // Handle optional filters
    const { tag, search } = req.query;
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    if (search) {
      query = {
        ...query,
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { summary: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ]
      };
    }
    
    // Get blogs with pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const blogs = await Blog.find(query)
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    const total = await Blog.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      pagination: {
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        hasMore: startIndex + blogs.length < total
      },
      data: blogs
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single blog post
// @route   GET /api/blogs/:id
// @access  Public/Private (depends on publish status)
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Check if blog is published or user is admin
    if (!blog.isPublished && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single blog post by slug
// @route   GET /api/blogs/slug/:slug
// @access  Public/Private (depends on publish status)
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('author', 'name email');
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Check if blog is published or user is admin
    if (!blog.isPublished && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Get blog by slug error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update blog post
// @route   PUT /api/blogs/:id
// @access  Private (Admin only)
export const updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    const { title, content, summary, tags, isPublished } = req.body;
    
    // Handle file upload if present
    if (req.files && req.files.coverImage) {
      const uploadResult = await fileUpload(req.files.coverImage, 'blogs');
      if (!uploadResult.success) {
        return res.status(400).json({ success: false, message: uploadResult.message });
      }
      blog.coverImage = uploadResult.fileName;
    }
    
    // Update fields
    if (title) {
      blog.title = title;
      // Generate new slug from title if title changes
      blog.slug = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    if (content) blog.content = content;
    if (summary) blog.summary = summary;
    if (tags) blog.tags = JSON.parse(tags);
    if (isPublished !== undefined) blog.isPublished = isPublished === 'true';
    
    blog.updatedAt = Date.now();
    
    await blog.save();
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete blog post
// @route   DELETE /api/blogs/:id
// @access  Private (Admin only)
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    await blog.remove();
    
    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Toggle blog publish status
// @route   PATCH /api/blogs/:id/publish
// @access  Private (Admin only)
export const toggleBlogPublishStatus = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    blog.isPublished = !blog.isPublished;
    await blog.save();
    
    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Toggle blog publish status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get blog tags
// @route   GET /api/blogs/tags
// @access  Public
export const getBlogTags = async (req, res) => {
  try {
    const tags = await Blog.distinct('tags');
    
    res.status(200).json({
      success: true,
      data: tags
    });
  } catch (error) {
    console.error('Get blog tags error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
