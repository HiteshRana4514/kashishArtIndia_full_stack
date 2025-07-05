import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiRequest } from '../utils/api';
import { useToast } from './ToastContext';

const MediaGalleryModal = ({ onClose, onSelect, maxSelect = 1 }) => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [filter, setFilter] = useState('all');
  const toast = useToast();

  // Fetch media files from the backend
  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        const response = await apiRequest('/media', 'GET', null, token);
        setMediaFiles(response.media || []);
      } catch (error) {
        toast.error('Failed to load media gallery');
        console.error('Error fetching media:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedia();
  }, [toast]);

  // Handle media selection
  const handleSelect = (mediaItem) => {
    // If we're already at max selection and trying to add a new item, show an error
    if (selectedMedia.length >= maxSelect && !selectedMedia.find(item => item.id === mediaItem.id)) {
      toast.error(`You can only select ${maxSelect} ${maxSelect === 1 ? 'file' : 'files'}`);
      return;
    }

    // Toggle selection
    setSelectedMedia(prev => {
      const isSelected = prev.find(item => item.id === mediaItem.id);
      if (isSelected) {
        return prev.filter(item => item.id !== mediaItem.id);
      } else {
        // If single selection mode, replace the array
        if (maxSelect === 1) {
          return [mediaItem];
        }
        // Otherwise add to the array
        return [...prev, mediaItem];
      }
    });
  };

  // Apply selection and close modal
  const handleApply = () => {
    if (selectedMedia.length === 0) {
      toast.error('Please select at least one media file');
      return;
    }
    onSelect(maxSelect === 1 ? selectedMedia[0] : selectedMedia);
    onClose();
  };

  // Filter media files by type
  const filteredMedia = filter === 'all' 
    ? mediaFiles
    : mediaFiles.filter(media => media.type === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <motion.div 
        className="bg-white rounded-lg p-4 w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Media Gallery</h2>
          <div className="flex gap-2">
            <select 
              className="border rounded px-3 py-1" 
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="all">All Media</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
            <button 
              className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={handleApply}
            >
              Apply ({selectedMedia.length}/{maxSelect})
            </button>
            <button 
              className="px-4 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {filter === 'all' ? 'No media files found' : `No ${filter} files found`}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-2">
              {filteredMedia.map((media) => (
                <div 
                  key={media.id}
                  onClick={() => handleSelect(media)} 
                  className={`
                    relative cursor-pointer rounded border overflow-hidden h-36
                    transition-all duration-200 hover:shadow-md
                    ${selectedMedia.find(item => item.id === media.id) ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'}
                  `}
                >
                  {/* Media preview based on type */}
                  {media.type === 'image' ? (
                    <img 
                      src={media.url} 
                      alt={media.filename} 
                      className="h-full w-full object-cover" 
                    />
                  ) : media.type === 'video' ? (
                    <div className="h-full w-full bg-gray-800 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Selection checkbox */}
                  <div className="absolute top-2 right-2">
                    <div className={`
                      h-6 w-6 flex items-center justify-center rounded-full border-2
                      ${selectedMedia.find(item => item.id === media.id) 
                        ? 'bg-blue-500 border-blue-500 text-white' 
                        : 'bg-white border-gray-300'}
                    `}>
                      {selectedMedia.find(item => item.id === media.id) && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  
                  {/* File name (truncated) */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs truncate">
                    {media.filename}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MediaGalleryModal;
