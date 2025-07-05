import express from 'express';
import { getAllMedia } from '../controllers/mediaController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Get all media files (protected route)
router.get('/', protect, getAllMedia);

export default router;
