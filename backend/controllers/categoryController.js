import Category from '../models/Category.js';
import fs from 'fs';
import path from 'path';

// Helper function to check if a URL is a Cloudinary URL
const isCloudinaryUrl = (url) => {
  return url && (url.includes('cloudinary.com') || url.includes('res.cloudinary.com'));
};

// GET /api/categories - get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/categories/:id - get category by ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/categories - create new category
export const createCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      // If file was uploaded, delete it since we won't create the category
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    // Handle image upload if present
    let image = null;
    if (req.file) {
      console.log('Category upload - file object keys:', Object.keys(req.file));
      
      // Check if the file has a URL provided by Cloudinary middleware
      if (req.file.url || (req.file.path && isCloudinaryUrl(req.file.path))) {
        // Use the Cloudinary URL directly
        image = req.file.url || req.file.path;
        console.log('Using Cloudinary URL for category image:', image);
      } else {
        // Fall back to local storage path
        const backendUrl = process.env.NODE_ENV === 'production' 
          ? 'https://kashishartindia-full-stack.onrender.com' 
          : 'http://localhost:5000';
        image = `${backendUrl}/uploads/${req.file.filename}`;
        console.log('Using local storage for category image:', image);
      }
    }
    
    const category = new Category({
      name,
      description,
      image,
      isActive: isActive !== undefined ? isActive : true
    });
    
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    // If file was uploaded, delete it on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// PUT /api/categories/:id - update category
export const updateCategory = async (req, res) => {
  try {
    const { name, description, isActive, keepExistingImage, removeImage, galleryImage, imageUrl } = req.body;
    
    // Check if another category with the same name exists
    if (name) {
      const existingCategory = await Category.findOne({ name, _id: { $ne: req.params.id } });
      if (existingCategory) {
        // If file was uploaded, delete it since we won't update
        if (req.file) {
          try {
            fs.unlinkSync(req.file.path);
          } catch (error) {
            console.error('Error deleting file:', error);
          }
        }
        return res.status(400).json({ message: 'Another category with this name already exists' });
      }
    }
    
    const category = await Category.findById(req.params.id);
    if (!category) {
      // Delete uploaded file if category not found
      if (req.file) {
        try {
          fs.unlinkSync(req.file.path);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      }
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Handle image based on form flags
    if (req.file) {
      console.log('Category update - file object keys:', Object.keys(req.file));
      
      // New file uploaded - replace the existing one
      // Delete old image if exists and it's a local file (not Cloudinary)
      if (category.image && !isCloudinaryUrl(category.image)) {
        try {
          // Extract filename from URL
          const oldImagePath = category.image.split('/uploads/')[1];
          if (oldImagePath) {
            const filePath = path.join(process.cwd(), 'uploads', oldImagePath);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log('Deleted old category image from local storage');
            }
          }
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      
      // Check if the file has a URL provided by Cloudinary middleware
      if (req.file.url || (req.file.path && isCloudinaryUrl(req.file.path))) {
        // Use the Cloudinary URL directly
        category.image = req.file.url || req.file.path;
        console.log('Using Cloudinary URL for updated category image:', category.image);
      } else {
        // Fall back to local storage path
        const backendUrl = process.env.NODE_ENV === 'production' 
          ? 'https://kashishartindia-full-stack.onrender.com' 
          : 'http://localhost:5000';
        category.image = `${backendUrl}/uploads/${req.file.filename}`;
        console.log('Using local storage for updated category image:', category.image);
      }
    } else if (imageUrl) {
      // Image selected from the gallery or existing URL
      console.log('Processing image URL:', imageUrl);
      
      // If it's a Cloudinary URL, use it directly
      if (isCloudinaryUrl(imageUrl)) {
        category.image = imageUrl;
        console.log('Using existing Cloudinary URL:', category.image);
      }
      // Extract the path portion if it's a full URL with /uploads/
      else if (imageUrl.includes('/uploads/')) {
        const pathPart = '/uploads/' + imageUrl.split('/uploads/')[1];
        const backendUrl = process.env.NODE_ENV === 'production' 
          ? 'https://kashishartindia-full-stack.onrender.com' 
          : 'http://localhost:5000';
        category.image = `${backendUrl}${pathPart}`;
        console.log('Using backend URL with path:', category.image);
      } else {
        category.image = imageUrl;
        console.log('Using provided image URL:', category.image);
      }
      console.log('Set category image:', category.image);
    } else if (removeImage === 'true' && category.image) {
      // User wants to remove the image
      try {
        // Only attempt to delete if it's a local file (not Cloudinary)
        if (!isCloudinaryUrl(category.image)) {
          const oldImagePath = category.image.split('/uploads/')[1];
          if (oldImagePath) {
            const filePath = path.join(process.cwd(), 'uploads', oldImagePath);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
              console.log('Deleted category image from local storage');
            }
          }
        } else {
          console.log('Not deleting Cloudinary image file (handled by Cloudinary)');
        }
        // Clear the image field
        category.image = null;
        console.log('Removed category image reference');
      } catch (error) {
        console.error('Error removing image:', error);
      }
    } 
    // If keepExistingImage is true, do nothing with the image
    
    if (name !== undefined) category.name = name;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;
    
    await category.save();
    res.json(category);
  } catch (err) {
    // Delete uploaded file on error
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// DELETE /api/categories/:id - delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    // Delete image file if it exists and it's a local file (not Cloudinary)
    if (category.image && !isCloudinaryUrl(category.image)) {
      try {
        // Extract filename from URL
        const imagePath = category.image.split('/uploads/')[1];
        if (imagePath) {
          const filePath = path.join(process.cwd(), 'uploads', imagePath);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('Deleted category image file during category deletion');
          }
        }
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    } else if (category.image) {
      console.log('Not deleting Cloudinary image (handled by Cloudinary)');
    }
    
    await category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
