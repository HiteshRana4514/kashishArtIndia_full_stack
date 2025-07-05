import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { uploadSingle, uploadMultiple, handleUploadError } from '../middleware/upload.js';
import {
  getAllPaintings,
  getPaintingById,
  createPainting,
  updatePainting,
  deletePainting
} from '../controllers/paintingController.js';

const router = express.Router();

// Public routes
router.get('/', getAllPaintings);
router.get('/:id', getPaintingById);

// Protected routes (admin only)
router.post('/', protect, authorize('admin'), uploadMultiple, handleUploadError, createPainting);
router.put('/:id', protect, authorize('admin'), uploadMultiple, handleUploadError, updatePainting);
router.delete('/:id', protect, authorize('admin'), deletePainting);

export default router;