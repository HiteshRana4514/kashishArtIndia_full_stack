import express from 'express';
import { getCloudinaryMedia, uploadToCloudinary } from '../controllers/cloudinaryMediaController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all media from Cloudinary (protected route)
router.get('/', protect, getCloudinaryMedia);

// Upload media directly to Cloudinary
router.post('/upload', protect, uploadToCloudinary);

export default router;
