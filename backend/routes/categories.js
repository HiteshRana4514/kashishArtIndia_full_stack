import express from 'express';
import { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), uploadSingle, handleUploadError, createCategory);
router.put('/:id', protect, authorize('admin'), uploadSingle, handleUploadError, updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;
