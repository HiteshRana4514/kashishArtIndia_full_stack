import express from 'express';
import { login, getMe, logout, setupAdmin, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/setup-admin', setupAdmin);

// Protected routes
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/change-password', protect, changePassword);

export default router; 