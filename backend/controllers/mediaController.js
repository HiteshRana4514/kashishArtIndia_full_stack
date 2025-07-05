import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);

// GET /api/media - get all uploaded media files
export const getAllMedia = async (req, res) => {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    
    // Check if uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      return res.status(200).json({ media: [] });
    }
    
    // Read all files in the uploads directory
    const files = await readdir(uploadsDir);
    
    // Generate URLs and get file information for each file
    const mediaFiles = await Promise.all(
      files.map(async (filename) => {
        const filePath = path.join(uploadsDir, filename);
        const fileStats = await stat(filePath);
        
        // Only include files, not directories
        if (!fileStats.isFile()) return null;
        
        // Create URL
        const backendUrl = process.env.NODE_ENV === 'production'
          ? 'https://your-production-api-url.com'
          : 'http://localhost:5000';
        const url = `${backendUrl}/uploads/${filename}`;
        
        // Get file extension for type determination
        const ext = path.extname(filename).toLowerCase();
        
        // Get file type
        let type = 'unknown';
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext)) {
          type = 'image';
        } else if (['.mp4', '.webm', '.ogg'].includes(ext)) {
          type = 'video';
        } else if (['.mp3', '.wav'].includes(ext)) {
          type = 'audio';
        } else if (['.pdf', '.doc', '.docx', '.xls', '.xlsx'].includes(ext)) {
          type = 'document';
        }
        
        return {
          id: filename,
          filename,
          url,
          type,
          size: fileStats.size,
          createdAt: fileStats.birthtime || fileStats.ctime,
          updatedAt: fileStats.mtime
        };
      })
    );
    
    // Filter out null values and sort by creation date (newest first)
    const filteredMedia = mediaFiles
      .filter(media => media !== null)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.status(200).json({ media: filteredMedia });
  } catch (error) {
    console.error('Error fetching media files:', error);
    res.status(500).json({ message: 'Error fetching media files', error: error.message });
  }
};

// Additional functions could be added here:
// - deleteMedia
// - uploadStandaloneMedia
// etc.
