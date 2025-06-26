import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all blog posts' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get blog post ${req.params.id}` });
});

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), uploadSingle, handleUploadError, (req, res) => {
  res.json({ message: 'Create blog post' });
});

router.put('/:id', protect, authorize('admin'), uploadSingle, handleUploadError, (req, res) => {
  res.json({ message: `Update blog post ${req.params.id}` });
});

router.delete('/:id', protect, authorize('admin'), (req, res) => {
  res.json({ message: `Delete blog post ${req.params.id}` });
});

export default router; 