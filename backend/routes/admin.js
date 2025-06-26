import express from 'express';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// All admin routes are protected
router.use(protect);
router.use(authorize('admin'));

// Dashboard stats
router.get('/stats', (req, res) => {
  res.json({ 
    message: 'Get dashboard stats',
    stats: {
      totalPaintings: 24,
      totalBlogPosts: 12,
      totalOrders: 8,
      recentActivity: [
        { type: 'painting', action: 'New painting "Sunset Valley" added', timestamp: new Date() },
        { type: 'blog', action: 'Blog post "Art of Landscape" published', timestamp: new Date() },
        { type: 'order', action: 'New order received for "Mountain View"', timestamp: new Date() }
      ]
    }
  });
});

// Admin settings
router.get('/settings', (req, res) => {
  res.json({ message: 'Get admin settings' });
});

router.put('/settings', (req, res) => {
  res.json({ message: 'Update admin settings' });
});

export default router; 