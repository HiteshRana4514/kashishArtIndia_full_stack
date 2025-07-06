import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// DIRECT CLOUDINARY CONFIG - Using hardcoded values for testing
// These are the values from your config.env file
cloudinary.config({
  cloud_name: 'dhshyzyak', 
  api_key: '115818884815146', 
  api_secret: '-2zVDEoj9RlfaEL0rcronT7POGE'
});

console.log('Cloudinary configured with direct values');

// Always use production mode for testing
const forceProduction = true;

// DIRECT STORAGE CONFIG - Always use Cloudinary storage
let storage;

// Use Cloudinary storage directly
try {
  storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'kashish_art_india',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      transformation: [{ quality: 'auto' }]
    }
  });
  console.log('Successfully configured Cloudinary storage for uploads');
} catch (error) {
  console.error('ERROR SETTING UP CLOUDINARY STORAGE:', error);
  // Fall back to disk storage if Cloudinary setup fails
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  console.log('Falling back to local disk storage due to Cloudinary error');
}

// File filter
const fileFilter = (req, file, cb) => {
  // Allow only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer with increased limits to prevent "Unexpected end of form" errors
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // Increased to 10MB default
    fieldSize: 20 * 1024 * 1024, // 20MB field size limit
    fields: 50,               // Maximum number of non-file fields
    files: 20,                // Maximum number of file fields
    parts: 100                // Maximum number of parts (fields + files)
  },
  fileFilter: fileFilter,
  preservePath: false        // Don't preserve the full path of files
});

// Single file upload
export const uploadSingle = upload.single('image');

// Blog cover image upload (more permissive)
export const uploadBlogCover = (req, res, next) => {
  console.log('Blog upload middleware - starting');
  console.log('Request body keys before upload:', Object.keys(req.body || {}));
  console.log('Request has files object:', !!req.files);
  
  // Use any() to accept any field name for maximum compatibility
  upload.any()(req, res, (err) => {
    if (err) {
      console.error('Blog upload middleware error:', err);
      return next(err);
    }
    
    console.log('Blog upload middleware - success');
    console.log('Files received:', req.files ? req.files.length : 'none');
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        console.log(`File ${index}:`, {
          fieldname: file.fieldname,
          originalname: file.originalname,
          size: file.size,
          mimetype: file.mimetype
        });
      });
    }
    
    next();
  });
};

// Helper function to generate URL from file path based on environment
const getFileUrl = (file) => {
  const backendUrl = process.env.NODE_ENV === 'production' 
    ? 'https://kashishartindia-full-stack.onrender.com' 
    : 'http://localhost:5000';

  // Debug log all available properties to find Cloudinary URL
  console.log('getFileUrl DEBUG - file object keys:', Object.keys(file));
  if (file.path) console.log('- file.path:', file.path);
  if (file.url) console.log('- file.url:', file.url);
  if (file.secure_url) console.log('- file.secure_url:', file.secure_url);
  if (file.filename) console.log('- file.filename:', file.filename);
  
  // Check for Cloudinary URLs in various properties
  const cloudinaryProperties = ['secure_url', 'url', 'path'];
  
  for (const prop of cloudinaryProperties) {
    if (file[prop] && typeof file[prop] === 'string') {
      // Check if it's a Cloudinary URL
      if (file[prop].includes('cloudinary.com') || file[prop].includes('res.cloudinary.com')) {
        console.log(`Using Cloudinary ${prop}: ${file[prop]}`);
        return file[prop];
      }
    }
  }

  // If file has a URL property from any source, use it
  if (file.url) {
    console.log(`Using existing url: ${file.url}`);
    return file.url;
  }

  // Fall back to local path
  if (file.filename) {
    const localUrl = `${backendUrl}/uploads/${file.filename}`;
    console.log(`Using constructed local path: ${localUrl}`);
    return localUrl;
  }
  
  // Last resort fallback
  console.error('Could not determine file URL - no filename or path available', file);
  return null;
};


// Multiple files upload - support both named fields (image_0, image_1, etc) and array field (images)
export const uploadMultiple = (req, res, next) => {
  // Create fields configuration that accepts both numbered fields and the traditional 'images' field
  const imageFields = {};
  
  // Add 'images' field that can have up to 5 files
  imageFields['images'] = 5;
  
  // Add numbered fields (image_0, image_1, etc) that can have 1 file each
  for (let i = 0; i < 10; i++) { // Support up to 10 individually named fields
    imageFields[`image_${i}`] = 1;
  }
  
  // Use fields() instead of array() to handle both approaches
  const uploadFields = upload.fields([
    // Original approach
    { name: 'images', maxCount: 5 },
    // Blog cover image field
    { name: 'coverImage', maxCount: 1 },
    // New approach with numbered fields
    ...Array.from({ length: 10 }, (_, i) => ({
      name: `image_${i}`, 
      maxCount: 1
    }))
  ]);
  
  uploadFields(req, res, (err) => {
    if (err) {
      // Forward to error handler
      return next(err);
    }
    
    // Merge all uploaded files into req.files for backward compatibility
    if (req.files) {
      // If using fields, we need to flatten the files for the controller
      const allFiles = [];
      
      // Process each field that has files
      Object.keys(req.files).forEach(fieldName => {
        if (Array.isArray(req.files[fieldName])) {
          req.files[fieldName].forEach(file => {
            allFiles.push(file);
          });
        }
      });
      
      // Process files to add URLs
      allFiles.forEach(file => {
        file.url = getFileUrl(file);
      });
      
      // Store the original structure but also provide a flattened array
      req.allFiles = allFiles;
      console.log(`Processed ${allFiles.length} files across ${Object.keys(req.files).length} fields`);
    }
    
    next();
  });
};

// Error handling middleware for multer and busboy-related errors
export const handleUploadError = (error, req, res, next) => {
  // Log the full error for debugging
  console.error('Upload error:', error);
  
  if (error instanceof multer.MulterError) {
    // Handle specific Multer errors with clear messages
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 5 files'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field'
      });
    }
    if (error.code === 'LIMIT_FIELD_KEY') {
      return res.status(400).json({
        success: false,
        message: 'Field name size exceeded'
      });
    }
    if (error.code === 'LIMIT_FIELD_VALUE') {
      return res.status(400).json({
        success: false,
        message: 'Field value size exceeded'
      });
    }
    if (error.code === 'LIMIT_PART_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many parts in the form'
      });
    }
    // Generic multer error
    return res.status(400).json({
      success: false,
      message: `File upload error: ${error.message}`
    });
  }
  
  // Handle busboy "Unexpected end of form" error
  if (error.message && (error.message.includes('Unexpected end of form') || 
                        error.message.includes('Unexpected end of multipart'))) {
    return res.status(400).json({
      success: false,
      message: 'Upload was interrupted or malformed. Please try again with a smaller file or better connection.'
    });
  }
  
  // Handle file type errors
  if (error.message === 'Only image files are allowed!') {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  // Any other error
  next(error);
}; 