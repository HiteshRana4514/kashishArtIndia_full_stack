import Painting from '../models/Painting.js';
import fs from 'fs';
import path from 'path';

// GET /api/paintings - fetch all paintings
export const getAllPaintings = async (req, res) => {
  try {
    const paintings = await Painting.find();
    res.json(paintings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/paintings/:id - fetch single painting
export const getPaintingById = async (req, res) => {
  try {
    const painting = await Painting.findById(req.params.id);
    if (!painting) return res.status(404).json({ message: 'Painting not found' });
    res.json(painting);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/paintings - create painting (with multiple image upload)
export const createPainting = async (req, res) => {
  try {
    console.log('Creating painting with body:', Object.keys(req.body));
    
    const {
      title,
      artist,
      category,
      price,
      description,
      medium,
      year,
      isAvailable,
      isFeatured,
      tags,
      size,
      fileCount
    } = req.body;
    
    // Include full backend URL for image paths
    const backendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://kashishartindia-full-stack.onrender.com' 
      : 'http://localhost:5000';
    
    // Extract all images from various possible file upload sources
    const images = [];
    
    // First check if we have the flattened files array from our custom middleware
    if (req.allFiles && Array.isArray(req.allFiles) && req.allFiles.length > 0) {
      console.log(`Using flattened allFiles array with ${req.allFiles.length} files`);
      images.push(...req.allFiles.map(file => `${backendUrl}/uploads/${file.filename}`));
    }
    // Legacy approach - direct array from multer upload.array
    else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      console.log(`Using array files with ${req.files.length} files`);
      images.push(...req.files.map(file => `${backendUrl}/uploads/${file.filename}`));
    }
    // Fields approach - from multer upload.fields
    else if (req.files && typeof req.files === 'object' && Object.keys(req.files).length > 0) {
      console.log(`Using fields object with keys: ${Object.keys(req.files)}`);
      
      for (const fieldName in req.files) {
        const filesInField = req.files[fieldName];
        if (Array.isArray(filesInField)) {
          filesInField.forEach(file => {
            console.log(`Processing file ${file.originalname} (${file.size} bytes) from ${fieldName}`);
            images.push(`${backendUrl}/uploads/${file.filename}`);
          });
        }
      }
    }
    // Single file case
    else if (req.file) {
      console.log(`Using single file: ${req.file.originalname}`);
      images.push(`${backendUrl}/uploads/${req.file.filename}`);
    }
    
    console.log(`Processed ${images.length} images for new painting`);
    
    // Ensure we have at least one image
    if (!images.length) {
      return res.status(400).json({ 
        message: 'At least one image is required',
        debug: {
          filesReceived: req.files ? Object.keys(req.files).length : 0,
          bodyKeys: Object.keys(req.body)
        }
      });
    }
    
    const painting = new Painting({
      title,
      artist,
      category,
      price,
      description,
      medium,
      year,
      isAvailable: isAvailable === 'true',
      isFeatured: isFeatured === 'true',
      tags: tags ? (typeof tags === 'string' && tags.startsWith('[') ? JSON.parse(tags) : 
             Array.isArray(tags) ? tags : [tags]) : [],
      size,
      images // store array of image paths
    });
    
    await painting.save();
    res.status(201).json(painting);
  } catch (err) {
    console.error('Error creating painting:', err);
    res.status(500).json({ 
      message: 'Server error while creating painting', 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// PUT /api/paintings/:id - update painting (with multiple image upload)
export const updatePainting = async (req, res) => {
  try {
    console.log(`Updating painting ${req.params.id} with body:`, Object.keys(req.body));
    console.log('Files received:', req.files ? 
      (Array.isArray(req.files) ? req.files.length : Object.keys(req.files).length) : 
      (req.file ? 1 : 0));
    
    const painting = await Painting.findById(req.params.id);
    if (!painting) return res.status(404).json({ message: 'Painting not found' });
    
    const {
      title,
      artist,
      category,
      price,
      description,
      medium,
      year,
      isAvailable,
      isFeatured,
      tags,
      size,
      existingImages,
      fileCount
    } = req.body;

    // Handle image updates - combine existing and new images
    const backendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://kashishartindia-full-stack.onrender.com' 
      : 'http://localhost:5000';
    
    // Parse existing images from JSON string if it exists
    let existingImagesList = [];
    if (existingImages) {
      try {
        existingImagesList = JSON.parse(existingImages);
        console.log(`Found ${existingImagesList.length} existing images`);
      } catch (err) {
        // Handle case where existingImages might be a direct array or single string
        existingImagesList = Array.isArray(existingImages) 
          ? existingImages 
          : typeof existingImages === 'string' ? [existingImages] : [];
        console.log(`Processed existing images as ${typeof existingImages}:`, existingImagesList.length);
      }
    }
    
    // Extract all new images using the same approach as createPainting
    const newUploadedImages = [];
    
    // First check if we have the flattened files array from our custom middleware
    if (req.allFiles && Array.isArray(req.allFiles) && req.allFiles.length > 0) {
      console.log(`Using flattened allFiles array with ${req.allFiles.length} files`);
      newUploadedImages.push(...req.allFiles.map(file => `${backendUrl}/uploads/${file.filename}`));
    }
    // Legacy approach - direct array from multer upload.array
    else if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      console.log(`Using array files with ${req.files.length} files`);
      newUploadedImages.push(...req.files.map(file => `${backendUrl}/uploads/${file.filename}`));
    }
    // Fields approach - from multer upload.fields
    else if (req.files && typeof req.files === 'object' && Object.keys(req.files).length > 0) {
      console.log(`Using fields object with keys: ${Object.keys(req.files)}`);
      
      for (const fieldName in req.files) {
        const filesInField = req.files[fieldName];
        if (Array.isArray(filesInField)) {
          filesInField.forEach(file => {
            console.log(`Processing file ${file.originalname} (${file.size} bytes) from ${fieldName}`);
            newUploadedImages.push(`${backendUrl}/uploads/${file.filename}`);
          });
        }
      }
    }
    // Single file case
    else if (req.file) {
      console.log(`Using single file: ${req.file.originalname}`);
      newUploadedImages.push(`${backendUrl}/uploads/${req.file.filename}`);
    }
    
    console.log(`Added ${newUploadedImages.length} new images`);
    
    // Combine existing and new images
    painting.images = [...existingImagesList, ...newUploadedImages];
    console.log(`Total images after update: ${painting.images.length}`);
    
    // Only process images if they're part of this update request (existingImages is present or files uploaded)
    const isImageUpdateRequest = existingImages !== undefined || newUploadedImages.length > 0;
    
    if (isImageUpdateRequest) {
      // Find images that need to be deleted (in old images but not in existingImagesList)
      const imagesToDelete = painting.images.filter(oldImg => 
        !existingImagesList.includes(oldImg)
      );
      
      // Delete removed image files from disk - but only if not used by other paintings
      for (const imageUrl of imagesToDelete) {
        try {
          // Check if any other painting uses this image before deleting
          const otherPaintingsUsingThisImage = await Painting.find({
            _id: { $ne: req.params.id }, // exclude current painting
            images: imageUrl // find paintings containing this image URL
          }).countDocuments();
          
          // Only delete if no other paintings use this image
          if (otherPaintingsUsingThisImage === 0) {
            const imagePath = imageUrl.split('/uploads/')[1];
            if (imagePath) {
              const filePath = path.join(process.cwd(), 'uploads', imagePath);
              if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Deleted image: ${filePath}`);
              }
            }
          } else {
            console.log(`Skipped deleting ${imageUrl} - still used by ${otherPaintingsUsingThisImage} other painting(s)`);
          }
        } catch (error) {
          console.error(`Error handling image: ${error.message}`);
        }
      }
      
      // Set the new images list (kept existing + new uploads)
      painting.images = [...existingImagesList, ...newImages];
    }
    // If not an image update request, preserve existing images
    if (title !== undefined) painting.title = title;
    if (artist !== undefined) painting.artist = artist;
    if (category !== undefined) painting.category = category;
    if (price !== undefined) painting.price = price;
    if (description !== undefined) painting.description = description;
    if (medium !== undefined) painting.medium = medium;
    if (year !== undefined) painting.year = year;
    if (isAvailable !== undefined) painting.isAvailable = isAvailable;
    if (isFeatured !== undefined) painting.isFeatured = isFeatured;
    if (tags !== undefined) painting.tags = Array.isArray(tags) ? tags : [tags];
    if (size !== undefined) painting.size = size;
    await painting.save();
    res.json(painting);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/paintings/:id - delete painting
export const deletePainting = async (req, res) => {
  try {
    const painting = await Painting.findById(req.params.id);
    if (!painting) return res.status(404).json({ message: 'Painting not found' });
    // Delete image files if they exist
    if (painting.images) {
      for (let imagePath of painting.images) {
        try {
          const filePath = path.join(process.cwd(), imagePath);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (err) {
          console.error(`Error deleting file: ${err.message}`);
        }
      }
    }
    await painting.deleteOne();
    res.json({ message: 'Painting deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/categories - get unique categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Painting.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
