import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiRequest, apiRequestMultipart } from '../../utils/api';
import { useToast } from '../../components/ToastContext';
import MediaGalleryModal from '../../components/MediaGalleryModal';

const CategoriesContent = () => {
  // State management
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [editId, setEditId] = useState(null);
  const toast = useToast();
  
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: null,
    isActive: true
  });

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        const response = await apiRequest('/categories', 'GET', null, token);
        // Make sure categories is an array
        const categoriesArray = Array.isArray(response.categories) ? response.categories : [];
        setCategories(categoriesArray);
      } catch (err) {
        toast.error(err.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, [toast]);

  // Open modal for add or edit
  const handleOpenModal = (category = null) => {
    if (category) {
      setEditId(category._id);
      setForm({
        name: category.name,
        description: category.description || '',
        image: category.image || null,
        isActive: category.isActive
      });
    } else {
      setEditId(null);
      setForm({ name: '', description: '', image: null, isActive: true });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);
  
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  // Add or update category (backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      
      // Always use FormData to handle images consistently
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('isActive', form.isActive);
      
      // Handle the image field
      if (form.image instanceof File) {
        // New image upload
        formData.append('image', form.image);
      } else if (typeof form.image === 'string' && form.image) {
        // Existing image or gallery selected image
        if (form.image.startsWith('/uploads/')) {
          // Gallery image selected
          formData.append('galleryImage', form.image);
        } else {
          // Keep existing image
          formData.append('keepExistingImage', 'true');
        }
        // Always send the image URL for reference
        formData.append('imageUrl', form.image);
      } else {
        // No image or removed image
        formData.append('removeImage', 'true');
      }
      
      if (editId) {
        await apiRequestMultipart(`/categories/${editId}`, 'PUT', formData, token);
        toast.success('Category updated successfully');
      } else {
        await apiRequestMultipart('/categories', 'POST', formData, token);
        toast.success('Category added successfully');
      }
      
      // Refetch categories after add/edit
      const response = await apiRequest('/categories', 'GET', null, token);
      setCategories(response.categories || []);
      setShowModal(false);
    } catch (err) {
      toast.error(err.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  // Delete category (backend)
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await apiRequest(`/categories/${id}`, 'DELETE', null, token);
      setCategories(categories.filter((c) => c._id !== id));
      toast.success('Category deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Manage Categories</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors btn-animate"
        >
          + Add New Category
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading && categories.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading categories...
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                  No categories found. Create your first category!
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.image ? (
                      <div className="h-16 w-16 rounded overflow-hidden bg-gray-100">
                        <img 
                          src={category.image} 
                          alt={category.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-16 w-16 rounded bg-gray-200 flex items-center justify-center text-gray-400">
                        <span className="text-xs">No image</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.description || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {category.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleOpenModal(category)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs btn-animate"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs btn-animate"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal for Add/Edit Category */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <span className="text-xl">×</span>
            </button>
            <h3 className="text-xl font-bold mb-6">
              {editId ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="image">
                  Image
                </label>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setForm({ ...form, image: e.target.files[0] });
                      }
                    }}
                    className="flex-1 min-w-0 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowMediaGallery(true)}
                    className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 whitespace-nowrap flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Gallery
                  </button>
                </div>
                {/* Image Preview */}
                {(form.image instanceof File || typeof form.image === 'string') && (
                  <div className="mt-2">
                    <div className="relative w-32 h-32 rounded overflow-hidden border border-gray-300">
                      <img 
                        src={form.image instanceof File ? URL.createObjectURL(form.image) : form.image}
                        alt="Category Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setForm({ ...form, image: null });
                          // Visual feedback for removal
                          toast.info('Image will be removed when you save');
                        }}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        title="Remove Image"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Active
                </label>
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {editId ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Media Gallery Modal */}
      {showMediaGallery && (
        <MediaGalleryModal
          onClose={() => setShowMediaGallery(false)}
          onSelect={(mediaItem) => {
            console.log('Selected image from gallery:', mediaItem);
            
            // Process URL to ensure proper format
            let imageUrl = mediaItem.url;
            if (imageUrl && imageUrl.startsWith('/uploads/')) {
              const backendUrl = process.env.NODE_ENV === 'production'
                ? 'https://kashishartindia-full-stack.onrender.com'
                : 'http://localhost:5000';
              imageUrl = `${backendUrl}${imageUrl}`;
            }
            
            console.log('Processed image URL:', imageUrl);
            setForm({ ...form, image: imageUrl });
            setShowMediaGallery(false);
            toast.success('Image selected from gallery');
          }}
          maxSelect={1}
        />
      )}
    </motion.div>
  );
};

export default CategoriesContent;
