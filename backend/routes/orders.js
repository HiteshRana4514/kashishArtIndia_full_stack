import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', (req, res) => {
  res.json({ message: 'Create order' });
});

// Protected routes (admin only)
router.get('/', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Get all orders' });
});

router.get('/:id', protect, authorize('admin'), (req, res) => {
  res.json({ message: `Get order ${req.params.id}` });
});

router.put('/:id', protect, authorize('admin'), (req, res) => {
  res.json({ message: `Update order ${req.params.id}` });
});

router.delete('/:id', protect, authorize('admin'), (req, res) => {
  res.json({ message: `Delete order ${req.params.id}` });
});

export default router; 