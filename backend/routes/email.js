import express from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { sendContactEmail, testEmailService } from '../controllers/emailController.js';
import emailService from '../utils/emailService.js';

const router = express.Router();

// Public route for contact form submissions
router.post('/contact', sendContactEmail);

// Protected route for testing email service (admin only)
router.post('/test', protect, authorize('admin'), testEmailService);

// Quick test route that doesn't require authentication - for troubleshooting only
router.get('/quick-test', async (req, res) => {
  try {
    // Use a query parameter for email, with fallback to hardcoded value
    const testEmail = req.query.email || 'hiteshrana1218@gmail.com';
    
    console.log(`Quick test email being sent to: ${testEmail}`);
    
    const result = await emailService.sendEmail({
      to: testEmail,
      subject: 'Kashish Art India - Quick Test',
      text: 'This is a quick test email from Kashish Art India.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #b45309;">Quick Test Email</h2>
          <p>This is a test email from Kashish Art India.</p>
          <p>If you received this email, the email functionality is working correctly with our Hostinger SMTP settings.</p>
          <hr>
          <p>Sent at: ${new Date().toISOString()}</p>
        </div>
      `
    });
    
    res.json({
      success: result.success,
      message: result.success ? 'Quick test email sent successfully!' : 'Failed to send email',
      details: result
    });
  } catch (error) {
    console.error('Quick test email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error sending quick test email', 
      error: error.message 
    });
  }
});

export default router;
