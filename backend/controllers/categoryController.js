import Category from '../models/Category.js';
import fs from 'fs';
import path from 'path';

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
      // Include full backend URL for image path
      const backendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://kashishartindia-full-stack.onrender.com' 
        : 'http://localhost:5000';
      image = `${backendUrl}/uploads/${req.file.filename}`;
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
      // New file uploaded - replace the existing one
      // Delete old image if exists
      if (category.image) {
        try {
          // Extract filename from URL
          const oldImagePath = category.image.split('/uploads/')[1];
          if (oldImagePath) {
            const filePath = path.join(process.cwd(), 'uploads', oldImagePath);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          }
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      
      // Set new image path
      const backendUrl = process.env.NODE_ENV === 'production' 
        ? 'https://kashishartindia-full-stack.onrender.com' 
        : 'http://localhost:5000';
      category.image = `${backendUrl}/uploads/${req.file.filename}`;
    } else if (imageUrl) {
      // Image selected from the gallery or existing URL
      console.log('Processing image URL:', imageUrl);
      
      // Extract the path portion if it's a full URL
      if (imageUrl.includes('/uploads/')) {
        const pathPart = '/uploads/' + imageUrl.split('/uploads/')[1];
        const backendUrl = process.env.NODE_ENV === 'production' 
          ? 'https://kashishartindia-full-stack.onrender.com' 
          : 'http://localhost:5000';
        category.image = `${backendUrl}${pathPart}`;
      } else {
        category.image = imageUrl;
      }
      console.log('Set category image:', category.image);
    } else if (removeImage === 'true' && category.image) {
      // User wants to remove the image
      try {
        // Delete the image file
        const oldImagePath = category.image.split('/uploads/')[1];
        if (oldImagePath) {
          const filePath = path.join(process.cwd(), 'uploads', oldImagePath);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
        // Clear the image field
        category.image = null;
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
    
    // Delete image file if it exists
    if (category.image) {
      try {
        // Extract filename from URL
        const imagePath = category.image.split('/uploads/')[1];
        if (imagePath) {
          const filePath = path.join(process.cwd(), 'uploads', imagePath);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      } catch (error) {
        console.error('Error deleting image file:', error);
      }
    }
    
    await category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
