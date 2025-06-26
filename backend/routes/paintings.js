import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { uploadSingle, handleUploadError } from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/', (req, res) => {
  res.json({ message: 'Get all paintings' });
});

router.get('/:id', (req, res) => {
  res.json({ message: `Get painting ${req.params.id}` });
});

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), uploadSingle, handleUploadError, (req, res) => {
  res.json({ message: 'Create painting' });
});

router.put('/:id', protect, authorize('admin'), uploadSingle, handleUploadError, (req, res) => {
  res.json({ message: `Update painting ${req.params.id}` });
});

router.delete('/:id', protect, authorize('admin'), (req, res) => {
  res.json({ message: `Delete painting ${req.params.id}` });
});

export default router; 