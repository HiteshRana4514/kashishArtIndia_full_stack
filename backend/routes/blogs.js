import express from 'express';
import { 
  createBlog, 
  getBlogs, 
  getBlogById,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  toggleBlogPublishStatus,
  getBlogTags
} from '../controllers/blogController.js';
import { protect, authorize } from '../middleware/auth.js';
import { optionalAuth } from '../middleware/optionalAuth.js';

const router = express.Router();

// Public routes with optional authentication
router.get('/', optionalAuth, getBlogs);
router.get('/tags', getBlogTags);
router.get('/slug/:slug', getBlogBySlug);
router.get('/:id', getBlogById);

// Import file upload middleware
import { uploadBlogCover, handleUploadError } from '../middleware/upload.js';

// Admin only routes
router.post('/', protect, authorize('admin'), uploadBlogCover, handleUploadError, createBlog);
router.put('/:id', protect, authorize('admin'), uploadBlogCover, handleUploadError, updateBlog);
router.delete('/:id', protect, authorize('admin'), deleteBlog);
router.patch('/:id/publish', protect, authorize('admin'), toggleBlogPublishStatus);

export default router;
