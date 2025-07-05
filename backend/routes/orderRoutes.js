import express from 'express';
import { 
  createOrder, 
  getOrders, 
  getOrderById, 
  updateOrderStatus, 
  updateOrder, 
  deleteOrder 
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/', createOrder);

// Admin routes
router.get('/', protect, admin, getOrders);
router.get('/:id', protect, admin, getOrderById);
router.patch('/:id/status', protect, admin, updateOrderStatus);
router.put('/:id', protect, admin, updateOrder);
router.delete('/:id', protect, admin, deleteOrder);

export default router;
