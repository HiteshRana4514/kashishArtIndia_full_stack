import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus, 
  updateOrder, 
  deleteOrder 
} from '../controllers/orderController.js';

const router = express.Router();

// Public routes
router.post('/', createOrder);

// Protected routes (admin only)
router.get('/', protect, authorize('admin'), getOrders);
router.get('/:id', protect, authorize('admin'), getOrderById);
router.patch('/:id/status', protect, authorize('admin'), updateOrderStatus);
router.put('/:id', protect, authorize('admin'), updateOrder);
router.delete('/:id', protect, authorize('admin'), deleteOrder);

export default router; 