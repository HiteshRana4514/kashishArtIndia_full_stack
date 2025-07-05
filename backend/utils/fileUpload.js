import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Upload a file to the server
 * @param {Object} file - The file to upload (from req.files.fieldName)
 * @param {String} folder - The folder to save the file in (inside uploads directory)
 * @returns {Object} Object with success status and file name or error message
 */
export const fileUpload = async (file, folder = 'general') => {
  try {
    // Create the folder if it doesn't exist
    const uploadPath = path.join(__dirname, '..', 'uploads', folder);
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return {
        success: false,
        message: 'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.'
      };
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return {
        success: false,
        message: 'File size too large. Maximum size is 5MB.'
      };
    }
    
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.name);
    const fileName = `${folder}-${uniqueSuffix}${fileExt}`;
    const filePath = path.join(uploadPath, fileName);
    
    // Move the file
    await file.mv(filePath);
    
    return {
      success: true,
      fileName: fileName
    };
  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      message: 'File upload failed',
      error: error.message
    };
  }
};
