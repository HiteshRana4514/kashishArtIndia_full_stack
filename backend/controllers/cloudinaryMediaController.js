import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dhshyzyak', 
  api_key: process.env.CLOUDINARY_API_KEY || '115818884815146', 
  api_secret: process.env.CLOUDINARY_API_SECRET || '-2zVDEoj9RlfaEL0rcronT7POGE'
});

// GET /api/cloudinary-media - get all media from Cloudinary
export const getCloudinaryMedia = async (req, res) => {
  try {
    console.log('Fetching media from Cloudinary...');
    
    // Get media from Cloudinary with folder prefix
    const result = await cloudinary.search
      .expression('folder:kashish_art_india/*')
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();
    
    console.log(`Found ${result.resources.length} resources in Cloudinary`);
    
    // Format media for frontend
    const mediaFiles = result.resources.map(resource => ({
      id: resource.public_id,
      filename: resource.public_id.split('/').pop(),
      url: resource.secure_url,
      type: resource.resource_type === 'image' ? 'image' : 'document',
      size: resource.bytes,
      createdAt: resource.created_at,
      updatedAt: resource.uploaded_at || resource.created_at,
      width: resource.width,
      height: resource.height,
      format: resource.format,
      // Include the entire resource for debugging
      resource: resource
    }));
    
    res.status(200).json({ media: mediaFiles });
  } catch (error) {
    console.error('Error fetching Cloudinary media:', error);
    res.status(500).json({ 
      message: 'Error fetching Cloudinary media', 
      error: error.message 
    });
  }
};

// Additional function to upload media directly to Cloudinary
export const uploadToCloudinary = async (req, res) => {
  try {
    // Check if file exists in request
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'No files were uploaded.' });
    }
    
    const file = req.files.file;
    const uploadResult = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'kashish_art_india',
      resource_type: 'auto'
    });
    
    res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      resource: uploadResult
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    res.status(500).json({ 
      message: 'Error uploading to Cloudinary', 
      error: error.message 
    });
  }
};
