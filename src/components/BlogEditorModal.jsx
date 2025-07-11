import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from './ToastContext';
import { apiRequest, apiRequestMultipart } from '../utils/api';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import MediaGalleryModal from './MediaGalleryModal';

const BlogEditorModal = ({ blog, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [isCloudinaryImage, setIsCloudinaryImage] = useState(false);
  const toast = useToast();
  
  const isEdit = !!blog;
  
  // Populate form with blog data if in edit mode
  useEffect(() => {
    if (blog) {
      setTitle(blog.title || '');
      setContent(blog.content || '');
      setSummary(blog.summary || '');
      setTags(blog.tags ? blog.tags.join(', ') : '');
      setIsPublished(blog.isPublished || false);
      
      if (blog.coverImage) {
        setImagePreview(blog.coverImage);
        // Check if it's a Cloudinary URL
        if (blog.coverImage.includes('cloudinary.com')) {
          setIsCloudinaryImage(true);
        }
      }
    }
  }, [blog]);
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!content.trim()) newErrors.content = 'Content is required';
    if (!summary.trim()) newErrors.summary = 'Summary is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, WebP)');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }
    
    setCoverImage(file);
    setIsCloudinaryImage(false); // Reset the flag as we're using a file upload
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle image selection from Media Gallery
  const handleMediaSelect = (media) => {
    // Store the Cloudinary URL
    setImagePreview(media.url);
    setCoverImage(media.url); // Store URL instead of file
    setIsCloudinaryImage(true);
    setShowMediaGallery(false);
    toast.success('Image selected from gallery');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      // Prepare form data for file upload
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('summary', summary);
      
      // Convert tags string to array and add to form data
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
      formData.append('tags', JSON.stringify(tagsArray));
      
      formData.append('isPublished', isPublished);
      
      if (coverImage) {
        if (isCloudinaryImage) {
          // For Cloudinary images, just send the URL as a string
          formData.append('cloudinaryCoverImage', coverImage);
        } else {
          // For new file uploads, send the actual file
          formData.append('coverImage', coverImage);
        }
      }
      
      let response;
      
      if (isEdit) {
        response = await apiRequestMultipart(`/blogs/${blog._id}`, 'PUT', formData, token);
      } else {
        response = await apiRequestMultipart('/blogs', 'POST', formData, token);
      }
      
      if (response.success) {
        toast.success(`Blog ${isEdit ? 'updated' : 'created'} successfully`);
        onSave(response.data);
      } else {
        toast.error(response.message || `Failed to ${isEdit ? 'update' : 'create'} blog`);
      }
    } catch (error) {
      console.error(`Error ${isEdit ? 'updating' : 'creating'} blog:`, error);
      toast.error(`Error ${isEdit ? 'updating' : 'creating'} blog`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      ></div>
      
      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-4xl z-[110] max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 p-1 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            type="button"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                <div className="mt-3 text-center sm:mt-0 sm:text-left">
                  <h3 className="text-2xl leading-6 font-bold text-kashish-blue mb-4 border-b pb-2">
                    {isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-5 relative z-[120]">
                    {/* Title */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className={`w-full px-3 py-3 border rounded-md shadow-sm focus:ring-kashish-blue focus:border-kashish-blue ${
                          errors.title ? 'border-red-500' : 'border-gray-300'
                        } transition-all duration-300`}
                        placeholder="Enter blog title"
                      />
                      {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                    </div>
                    
                    {/* Cover Image */}
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Cover Image {!isEdit && <span className="text-gray-400 text-xs">(Optional)</span>}
                      </label>
                      <div className="mt-1 flex items-center relative z-[120]">
                        {imagePreview ? (
                          <div className="relative w-40 h-40 mr-3 rounded-md overflow-hidden border-2 border-kashish-blue">
                            <img
                              src={imagePreview}
                              alt="Cover preview"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setCoverImage(null);
                                setImagePreview('');
                              }}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors duration-200"
                              title="Remove image"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <div className="w-40 h-40 bg-gray-100 flex justify-center items-center rounded-md mr-3 border-2 border-dashed border-gray-300">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        )}
                        <div className="flex-1">
                          <label className="cursor-pointer inline-block bg-kashish-blue text-white py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-blue-600 focus:outline-none transition-colors duration-200">
                            <span>{imagePreview ? 'Change Image' : 'Upload Image'}</span>
                            <input
                              type="file"
                              className="sr-only"
                              accept="image/png, image/jpeg, image/jpg, image/webp"
                              onChange={handleImageChange}
                            />
                          </label>
                          <p className="mt-2 text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Summary */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Summary <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        rows="2"
                        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-kashish-blue focus:border-kashish-blue ${
                          errors.summary ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Brief summary of the blog post"
                        maxLength="500"
                      ></textarea>
                      <p className="text-xs text-gray-500 mt-1">
                        {summary.length}/500 characters
                      </p>
                      {errors.summary && <p className="mt-1 text-sm text-red-500">{errors.summary}</p>}
                    </div>
                    
                    {/* Content */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content <span className="text-red-500">*</span>
                      </label>
                      <div className={`${errors.content ? 'border border-red-500 rounded-md' : ''}`}>
                        <ReactQuill
                          theme="snow"
                          value={content}
                          onChange={setContent}
                          className="bg-white rounded-md"
                          modules={{
                            toolbar: [
                              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                              ['link', 'image'],
                              ['clean']
                            ],
                          }}
                          formats={[
                            'header',
                            'bold', 'italic', 'underline', 'strike', 'blockquote',
                            'list', 'bullet',
                            'link', 'image'
                          ]}
                          placeholder="Write your blog content here..."
                          style={{ height: '250px', marginBottom: '2rem' }}
                        />
                      </div>
                      {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
                    </div>
                    
                    {/* Tags */}
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags <span className="text-gray-400 text-xs">(Comma separated)</span>
                      </label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-kashish-blue focus:border-kashish-blue"
                        placeholder="art, painting, etc."
                      />
                    </div>
                    
                    {/* Publish Status */}
                    <div className="col-span-2 flex items-center mt-4">
                      <input
                        type="checkbox"
                        id="isPublished"
                        checked={isPublished}
                        onChange={() => setIsPublished(!isPublished)}
                        className="h-4 w-4 text-kashish-blue focus:ring-kashish-blue border-gray-300 rounded"
                      />
                      <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
                        Publish immediately
                      </label>
                    </div>
                    
                    <div className="col-span-2 flex justify-end space-x-3 mt-8 pt-5 border-t border-gray-200">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-kashish-blue hover:bg-blue-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors duration-200"
                      >
                        {loading && (
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                        {isEdit ? 'Update Blog' : 'Create Blog'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Media Gallery Modal */}
      {showMediaGallery && (
        <MediaGalleryModal 
          onClose={() => setShowMediaGallery(false)} 
          onSelect={handleMediaSelect}
          maxSelect={1} 
        />
      )}
    </div>
  );
};

export default BlogEditorModal;
