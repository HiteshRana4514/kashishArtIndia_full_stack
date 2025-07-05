import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Optional authentication middleware
// Checks for authentication but doesn't block if no token
export const optionalAuth = async (req, res, next) => {
  let token;

  // Check for token in headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    
    if (token) {
      try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
        // Get user from token
        const user = await User.findById(decoded.id).select('-password');
  
        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token invalid but we continue anyway
        console.log('Optional auth token invalid:', error.message);
      }
    }
  }
  
  // Always continue to next middleware
  next();
};
