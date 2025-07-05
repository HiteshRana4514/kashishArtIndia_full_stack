import emailService from '../utils/emailService.js';
import asyncHandler from 'express-async-handler';

/**
 * @desc    Send contact form email
 * @route   POST /api/email/contact
 * @access  Public
 */
export const sendContactEmail = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate input
  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error('Please provide all required fields');
  }

  console.log('Contact form submission received:', { name, email, subject });

  // Send email to admin (hardcoded email address for reliability)
  const result = await emailService.sendEmail({
    to: 'info@kashishartindia.com', // Hardcoded admin email
    subject: `New Contact Form: ${subject}`,
    text: `
      New contact form submission:
      
      Name: ${name}
      Email: ${email}
      Subject: ${subject}
      
      Message:
      ${message}
      
      Received on: ${new Date().toLocaleString()}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #b45309;">New Contact Form Submission</h2>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
        </div>
        
        <h3 style="color: #1f2937;">Message</h3>
        <p style="background-color: white; padding: 10px; border-left: 4px solid #b45309;">
          ${message.replace(/\n/g, '<br>')}
        </p>
        
        <p style="color: #666; font-size: 0.9em;">Received on: ${new Date().toLocaleString()}</p>
      </div>
    `
  });

  // Also send an acknowledgement to the user
  const acknowledgeResult = await emailService.sendEmail({
    to: email,
    subject: `Thank you for contacting Kashish Art India`,
    text: `
      Dear ${name},
      
      Thank you for reaching out to Kashish Art India. We have received your message regarding "${subject}".
      
      Our team will review your inquiry and get back to you as soon as possible.
      
      Best regards,
      Team Kashish Art India
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #b45309;">Thank You for Contacting Us</h2>
        <p>Dear ${name},</p>
        <p>Thank you for reaching out to Kashish Art India. We have received your message regarding "${subject}".</p>
        <p>Our team will review your inquiry and get back to you as soon as possible.</p>
        <p>Best regards,<br>Team Kashish Art India</p>
      </div>
    `
  });

  if (result.success) {
    console.log('Contact form email sent successfully to admin');
    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
      adminEmailSent: result.success,
      acknowledgeEmailSent: acknowledgeResult.success
    });
  } else {
    console.error('Failed to send contact form email:', result.error);
    res.status(500);
    throw new Error('Failed to send email. Please try again later.');
  }
});

/**
 * @desc    Test email service
 * @route   POST /api/email/test
 * @access  Private (Admin only)
 */
export const testEmailService = asyncHandler(async (req, res) => {
  try {
    // Log the email configuration for debugging
    console.log('Email Configuration:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      username: process.env.EMAIL_USERNAME,
      fromName: process.env.EMAIL_FROM_NAME,
      from: process.env.EMAIL_FROM,
      // Don't log the full password
      passwordProvided: !!process.env.EMAIL_PASSWORD
    });
    
    const recipientEmail = req.body.email || 'info@kashishartindia.com'; // Hardcoded admin email
    console.log(`Attempting to send test email to: ${recipientEmail}`);
    
    const testResult = await emailService.sendEmail({
      to: recipientEmail,
      subject: 'Email Service Test - Kashish Art India',
      text: 'This is a test email from Kashish Art India. If you received this, the email service is working correctly!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #b45309;">Email Service Test</h2>
          <p>This is a test email from Kashish Art India.</p>
          <p>If you received this, the email service is working correctly!</p>
          <hr>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
      `
    });

    console.log('Email test result:', testResult);

    if (testResult.success) {
      res.status(200).json({
        success: true,
        message: 'Test email sent successfully',
        messageId: testResult.messageId,
        sentTo: recipientEmail
      });
    } else {
      console.error('Email test failed:', testResult.error);
      res.status(500).json({
        success: false,
        message: 'Failed to send test email',
        error: testResult.error,
        config: {
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT
        }
      });
    }
  } catch (error) {
    console.error('Email service test threw an exception:', error);
    res.status(500).json({
      success: false,
      message: 'Email service test threw an exception',
      error: error.message
    });
  }
});
