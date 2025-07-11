import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import Blog from '../models/Blog.js';
import { fileUpload } from '../utils/fileUpload.js';

// Helper function to check if a URL is a Cloudinary URL
const isCloudinaryUrl = (url) => {
  return url && (url.includes('cloudinary.com') || url.includes('res.cloudinary.com'));
};

// Helper function to get file URL from uploaded file
const getFileUrl = (file) => {
  console.log('Blog getFileUrl - file keys:', Object.keys(file));
  
  // Check for Cloudinary URLs in various properties
  if (file.url) {
    console.log('Using file.url from Cloudinary:', file.url);
    return file.url;
  }
  
  if (file.path && isCloudinaryUrl(file.path)) {
    console.log('Using file.path from Cloudinary:', file.path);
    return file.path;
  }
  
  if (file.secure_url) {
    console.log('Using file.secure_url from Cloudinary:', file.secure_url);
    return file.secure_url;
  }
  
  // Default to local file path
  const backendUrl = process.env.NODE_ENV === 'production'
    ? 'https://kashishartindia-full-stack.onrender.com' 
    : 'http://localhost:5000';
  const localUrl = `${backendUrl}/uploads/${file.filename}`;
  console.log('Using local file URL:', localUrl);
  return localUrl;
};

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private (Admin only)
export const createBlog = async (req, res) => {
  try {
    console.log('Create Blog - Request body:', req.body);
    console.log('Create Blog - Request headers:', req.headers);
    console.log('Create Blog - User:', req.user);
    
    // Extract data from request
    const { title, content, summary, tags, isPublished, cloudinaryCoverImage } = req.body;
    console.log('Extracted blog data:', { title, content, summary, tags, isPublished });
    let coverImage = null;

    // Handle file upload if present
    console.log('Blog create - req.files structure:', req.files ? `Array with ${req.files.length} files` : 'No files');
    
    // Check if a Cloudinary URL was sent directly
    if (cloudinaryCoverImage) {
      coverImage = cloudinaryCoverImage;
      console.log('Using provided Cloudinary URL for cover image:', coverImage);
    }
    // Check if files are present (using upload.any() middleware structure, which gives an array)
    else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      // Find the first file with fieldname 'coverImage'
      const coverImageFile = req.files.find(file => file.fieldname === 'coverImage');
      
      if (coverImageFile) {
        console.log('Found coverImage file:', {
          fieldname: coverImageFile.fieldname,
          originalname: coverImageFile.originalname,
          size: coverImageFile.size,
          mimetype: coverImageFile.mimetype,
          path: coverImageFile.path
        });
        
        // Check if it's from Cloudinary (will have url or path with cloudinary.com)
        if (coverImageFile.path && coverImageFile.path.includes('cloudinary.com')) {
          coverImage = coverImageFile.path;
          console.log('Using Cloudinary path directly:', coverImage);
        } 
        else if (coverImageFile.url) {
          coverImage = coverImageFile.url;
          console.log('Using file URL directly:', coverImage);
        }
        else if (coverImageFile.secure_url) {
          coverImage = coverImageFile.secure_url;
          console.log('Using file secure_url directly:', coverImage);
        }
        // Fall back to filename
        else if (coverImageFile.filename) {
          coverImage = coverImageFile.filename;
          console.log('Using filename for local path:', coverImage);
        }
      } else {
        console.log('No coverImage field found in uploaded files. Available fields:', 
          req.files.map(f => f.fieldname).join(', '));
      }
    }
    
    // Process input data
    console.log('Creating blog with title:', title);
    console.log('Cover image received:', coverImage);

    // Generate slug from title (with validation to prevent errors)
    let slug = '';
    if (title) {
      slug = encodeURIComponent(
        title
          .trim()
          .replace(/\s+/g, '-') // replace spaces with dashes
      );
    } else {
      // If title is missing, generate a fallback slug
      slug = 'blog-' + Date.now();
      console.warn('Blog created without title, using timestamp slug:', slug);
    }
    
    // Check if the cover image is already a complete URL (Cloudinary)
    if (coverImage && (coverImage.startsWith('http://') || coverImage.startsWith('https://'))) {
      // Use the URL as is - don't modify Cloudinary URLs
      console.log('Using complete URL for cover image:', coverImage);
    } else if (coverImage) {
      // Only add backend URL prefix for local files
      const backendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://kashishartindia-full-stack.onrender.com'
        : 'http://localhost:5000';
      coverImage = `${backendUrl}/uploads/blogs/${coverImage}`;
      console.log('Adding backend URL prefix to cover image:', coverImage);
    }

    // Make sure required fields exist
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required'
      });
    }
    
    if (!summary) {
      return res.status(400).json({
        success: false,
        message: 'Summary is required'
      });
    }
    
    // Check for authentication - provide debugging info
    if (!req.user) {
      console.error('User not authenticated - req.user is missing');
      console.log('Headers:', req.headers);
    } else if (!req.user.id) {
      console.error('User authenticated but ID missing:', req.user);
    } else {
      console.log('User authenticated successfully:', req.user.id);
    }
    
    // For development/testing - find an admin user to use if authentication is missing
    let authorId = null;
    
    if (req.user && req.user.id) {
      authorId = req.user.id;
      console.log('Using authenticated user ID:', authorId);
    } else {
      // Temporarily use a hardcoded ID or find the first admin user
      // This is only for development/testing - in production, proper authentication should be enforced
      try {
        // Find the first available user to use as author (development only)
        const User = mongoose.model('User');
        const adminUser = await User.findOne({ role: 'admin' });
        if (adminUser) {
          authorId = adminUser._id;
          console.log('Using fallback admin ID:', authorId);
        } else {
          // If no admin found, this will fail validation as expected
          console.error('No admin user found for fallback');
        }
      } catch (err) {
        console.error('Error finding fallback admin:', err.message);
      }
    }
    
    // Create blog with the logged-in user as author or fallback
    const blogData = {
      title: title || 'Untitled Blog', // Provide fallback for title
      slug, // Explicitly set the slug
      content: content || 'Content placeholder', // Provide fallback for content
      summary: summary || 'Summary placeholder', // Provide fallback for summary
      coverImage,
      tags: tags ? (typeof tags === 'string' ? JSON.parse(tags) : tags) : [],
      isPublished: isPublished === 'true',
      author: authorId
    };
    
    console.log('Creating blog with data:', blogData);
    try {
      const blog = await Blog.create(blogData);
      console.log('Blog created successfully:', blog._id);
      
      return res.status(201).json({
        success: true,
        data: blog
      });
    } catch (err) {
      console.error('Failed to create blog:', err);
      return res.status(400).json({
        success: false,
        message: 'Blog creation failed',
        error: err.message
      });
    }
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
    const decodedSlug = encodeURIComponent(req.params.slug);
    const blog = await Blog.findOne({ slug: decodedSlug })
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
    
    const { title, content, summary, tags, isPublished, cloudinaryCoverImage } = req.body;
    
    // Variables for file handling
    let newCoverImage = null;
    
    // Check if a Cloudinary URL was sent directly
    if (cloudinaryCoverImage) {
      newCoverImage = cloudinaryCoverImage;
      console.log('Using provided Cloudinary URL for cover image update:', newCoverImage);
    } 
    // Otherwise check if files are present (using upload.any() middleware structure, which gives an array)
    else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      // Find the first file with fieldname 'coverImage'
      const coverImageFile = req.files.find(file => file.fieldname === 'coverImage');
      
      if (coverImageFile) {
        console.log('Found coverImage file for update:', {
          fieldname: coverImageFile.fieldname,
          originalname: coverImageFile.originalname,
          size: coverImageFile.size,
          mimetype: coverImageFile.mimetype,
          path: coverImageFile.path
        });
        
        // Check if it's from Cloudinary (will have url or path with cloudinary.com)
        if (coverImageFile.path && coverImageFile.path.includes('cloudinary.com')) {
          newCoverImage = coverImageFile.path;
          console.log('Using Cloudinary path directly for update:', newCoverImage);
        } 
        else if (coverImageFile.url) {
          newCoverImage = coverImageFile.url;
          console.log('Using file URL directly for update:', newCoverImage);
        }
        else if (coverImageFile.secure_url) {
          newCoverImage = coverImageFile.secure_url;
          console.log('Using file secure_url directly for update:', newCoverImage);
        }
        // Fall back to filename
        else if (coverImageFile.filename) {
          newCoverImage = coverImageFile.filename;
          console.log('Using filename for local path for update:', newCoverImage);
        }
        
        // Delete old image if it's not a Cloudinary URL and we have a new image
        if (blog.coverImage && !isCloudinaryUrl(blog.coverImage) && newCoverImage) {
          try {
            console.log('Attempting to delete old cover image:', blog.coverImage);
            // We're not using fileDelete since it might not be available or properly set up
            // Instead, we'll just log it for now
          } catch (error) {
            console.error('Error handling old cover image:', error);
            // Continue anyway, it's not critical
          }
        }
      } else {
        console.log('No coverImage field found in uploaded files for update. Available fields:', 
          req.files.map(f => f.fieldname).join(', '));
      }
    }
    
    // Update fields
    if (title) {
      blog.title = title;
      // Generate new slug from title if title changes
      blog.slug = encodeURIComponent(
        title
          .trim()
          .replace(/\s+/g, '-') // replace spaces with dashes
      );
    } else if (title === '') {
      // If title is explicitly set to empty string
      console.warn('Blog updated with empty title, keeping original slug');
      // Keep existing slug if available, otherwise create a new one
      if (!blog.slug) {
        blog.slug = 'blog-' + Date.now();
      }
    }
    
    
    // Update cover image if we found a new one
    if (newCoverImage) {
      // Check if the new cover image is already a complete URL (e.g., Cloudinary)
      if (newCoverImage && (newCoverImage.startsWith('http://') || newCoverImage.startsWith('https://'))) {
        // Use the URL as is
        blog.coverImage = newCoverImage;
        console.log('Using complete URL for cover image update:', newCoverImage);
      } else if (newCoverImage) {
        // Add backend URL prefix only for local files
        const backendUrl = process.env.NODE_ENV === 'production' 
          ? 'https://kashishartindia-full-stack.onrender.com'
          : 'http://localhost:5000';
        blog.coverImage = `${backendUrl}/uploads/blogs/${newCoverImage}`;
        console.log('Adding backend URL prefix to cover image update:', blog.coverImage);
      }
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
    // Use findByIdAndDelete instead of findById followed by remove()
    const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
    
    if (!deletedBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Log deletion success
    console.log(`Blog ${req.params.id} successfully deleted`);
    
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
