import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Use a clean filename approach with better uniqueness
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const safeFileName = file.fieldname + '-' + uniqueSuffix + fileExtension;
    cb(null, safeFileName);
  }
});

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
    fields: 20,               // Maximum number of non-file fields
    files: 5,                 // Maximum number of file fields
    parts: 30                 // Maximum number of parts (fields + files)
  },
  fileFilter: fileFilter,
  preservePath: false        // Don't preserve the full path of files
});

// Single file upload
export const uploadSingle = upload.single('image');

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