import { useState, useEffect } from 'react';
import ImageGalleryPopup from '../../components/ImageGalleryPopup';
import { motion } from 'framer-motion';
import { apiRequest, apiRequestMultipart } from '../../utils/api';
import { useToast } from '../../components/ToastContext';
import MediaGalleryModal from '../../components/MediaGalleryModal';

const PaintingsContent = () => {
  // Gallery modal state
  const [showGallery, setShowGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryIdx, setGalleryIdx] = useState(0);
  
  // Media selection gallery
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  
  // Backend paintings and categories
  const [paintings, setPaintings] = useState([]);
  const [filteredPaintings, setFilteredPaintings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    isAvailable: '',
    isFeatured: ''
  });
  
  // Toast notifications
  const toast = useToast();
  
  const [form, setForm] = useState({
    title: '',
    category: '',
    medium: '',
    size: '',
    price: '',
    images: [],
    description: '',
    isAvailable: true,
    isFeatured: false
  });

  // Fetch paintings and categories from backend
  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        const paintingsRes = await apiRequest('/paintings', 'GET', null, token);
        const paintingsData = paintingsRes.paintings || paintingsRes;
        setPaintings(paintingsData);
        setFilteredPaintings(paintingsData);
        
        // Try to fetch categories endpoint, else extract from paintings
        try {
          const catRes = await apiRequest('/categories', 'GET', null, token);
          // Handle the category objects properly by extracting just the names
          const categoryNames = Array.isArray(catRes.categories) 
            ? catRes.categories.map(cat => cat.name)
            : [];
          setCategories(categoryNames);
        } catch {
          // fallback: extract unique categories from paintings
          const cats = [...new Set(paintingsData.map(p => p.category))];
          setCategories(cats);
        }
      } catch (err) {
        toast.error(err.message || 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);
  
  // Apply filters and search
  useEffect(() => {
    if (!paintings.length) return;
    
    let results = [...paintings];
    
    // Apply search term filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      results = results.filter(painting => 
        painting.title.toLowerCase().includes(search) ||
        painting.description.toLowerCase().includes(search) ||
        painting.medium.toLowerCase().includes(search) ||
        painting.category.toLowerCase().includes(search) ||
        (painting.size && painting.size.toLowerCase().includes(search))
      );
    }
    
    // Apply category filter
    if (filters.category) {
      results = results.filter(painting => painting.category === filters.category);
    }
    
    // Apply availability filter
    if (filters.isAvailable !== '') {
      const isAvailable = filters.isAvailable === 'true';
      results = results.filter(painting => painting.isAvailable === isAvailable);
    }
    
    // Apply featured filter
    if (filters.isFeatured !== '') {
      const isFeatured = filters.isFeatured === 'true';
      results = results.filter(painting => painting.isFeatured === isFeatured);
    }
    
    setFilteredPaintings(results);
  }, [paintings, searchTerm, filters]);

  // Open modal for add or edit
  const handleOpenModal = (painting = null) => {
    if (painting) {
      setEditId(painting._id);
      setForm({
        title: painting.title,
        category: painting.category,
        medium: painting.medium,
        size: painting.size,
        price: painting.price,
        images: painting.images || (painting.image ? [painting.image] : []),
        description: painting.description,
        isAvailable: painting.isAvailable !== undefined ? painting.isAvailable : true,
        isFeatured: painting.isFeatured !== undefined ? painting.isFeatured : false
      });
    } else {
      setEditId(null);
      setForm({
        title: '', 
        category: '', 
        medium: '', 
        size: '', 
        price: '', 
        images: [], 
        description: '',
        isAvailable: true,
        isFeatured: false
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);
  
  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  // Add or update painting (backend)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');      
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('category', form.category);
      formData.append('medium', form.medium);
      formData.append('size', form.size);
      formData.append('price', form.price);
      formData.append('description', form.description);
      formData.append('isAvailable', form.isAvailable);
      formData.append('isFeatured', form.isFeatured);
      
      // Handle existing and new images
      const existingImages = [];
      const newImages = [];
      
      // Separate string URLs (existing) from File objects (new uploads)
      form.images.forEach((img) => {
        if (typeof img === 'string') {
          existingImages.push(img);
        } else {
          newImages.push(img);
        }
      });
      
      // Add existing images as JSON string
      formData.append('existingImages', JSON.stringify(existingImages));
      
      // Add new image files
      newImages.forEach(img => {
        formData.append('images', img);
      });
      
      let res;
      if (editId) {
        res = await apiRequestMultipart(`/paintings/${editId}`, 'PUT', formData, token);
      } else {
        res = await apiRequestMultipart('/paintings', 'POST', formData, token);
      }
      
      // Refetch paintings after add/edit
      const paintingsRes = await apiRequest('/paintings', 'GET', null, token);
      setPaintings(paintingsRes.paintings || paintingsRes);
      setShowModal(false);
      toast.success(editId ? 'Painting updated successfully' : 'Painting added successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to save painting');
    } finally {
      setLoading(false);
    }
  };

  // Toggle painting status (isAvailable or isFeatured)
  const handleToggleStatus = async (id, field, value) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await apiRequest(`/paintings/${id}`, 'PUT', { [field]: value }, token);
      
      // Update the painting in state after successful update
      setPaintings(paintings.map(p => p._id === id ? { ...p, [field]: value } : p));
      toast.success(`Painting ${field === 'isAvailable' ? (value ? 'marked as in stock' : 'marked as out of stock') : (value ? 'featured' : 'unfeatured')}`);
    } catch (err) {
      toast.error(err.message || `Failed to update painting ${field}`);
    }
  };

  // Delete a painting from the backend
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this painting?')) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      await apiRequest(`/paintings/${id}`, 'DELETE', null, token);
      // Remove from state after successful deletion
      setPaintings(paintings.filter(p => p._id !== id));
      toast.success('Painting deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete painting');
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
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Manage Paintings</h2>
        <button
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors btn-animate"
        >
          + Add New Painting
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search paintings..." 
              className="w-full pl-10 pr-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <select 
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300" 
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">All Categories</option>
            {categories.map((cat, idx) => (
              <option key={idx} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={filters.isAvailable}
            onChange={(e) => setFilters({...filters, isAvailable: e.target.value})}
          >
            <option value="">All Status</option>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>

          <select 
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={filters.isFeatured}
            onChange={(e) => setFilters({...filters, isFeatured: e.target.value})}
          >
            <option value="">All Featured</option>
            <option value="true">Featured</option>
            <option value="false">Not Featured</option>
          </select>
          
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters({
                category: '',
                isAvailable: '',
                isFeatured: ''
              });
            }}
            className="px-3 py-2 border rounded-lg text-gray-600 hover:bg-gray-100 flex items-center gap-1"
            title="Reset all filters"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Reset
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Medium</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price (₹)</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={9} className="text-center py-6 text-gray-400">Loading...</td></tr>
            ) : filteredPaintings.length === 0 ? (
              <tr><td colSpan={9} className="text-center py-6 text-gray-400">No paintings match your filters.</td></tr>
            ) : (
              filteredPaintings.map((painting) => (
                <tr key={painting._id}>
                  <td className="px-4 py-2">
                    {painting.images && painting.images.length > 0 && (
                      <img
                        src={typeof painting.images[0] === 'string' ? painting.images[0] : URL.createObjectURL(painting.images[0])}
                        alt={painting.title + ' thumbnail'}
                        className="h-12 w-12 object-cover rounded shadow border cursor-pointer"
                        onClick={() => {
                          setGalleryImages(painting.images);
                          setGalleryIdx(0);
                          setShowGallery(true);
                        }}
                      />
                    )}
                  </td>
                  <td className="px-4 py-2 font-semibold text-gray-800">{painting.title}</td>
                  <td className="px-4 py-2">{painting.category}</td>
                  <td className="px-4 py-2">{painting.medium}</td>
                  <td className="px-4 py-2">{painting.size}</td>
                  <td className="px-4 py-2">₹{painting.price.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={painting.isAvailable} 
                          onChange={() => handleToggleStatus(painting._id, 'isAvailable', !painting.isAvailable)}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                      </label>
                      <span className="ml-2 text-sm font-medium text-gray-700 w-20">
                        {painting.isAvailable ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={painting.isFeatured} 
                          onChange={() => handleToggleStatus(painting._id, 'isFeatured', !painting.isFeatured)}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-orange-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
                      </label>
                    </div>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleOpenModal(painting)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs btn-animate"
                    >Edit</button>
                    <button
                      onClick={() => handleDelete(painting._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs btn-animate"
                    >Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Modal for Add/Edit Painting */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <span className="text-xl">×</span>
            </button>
            <h3 className="text-xl font-bold mb-6">
              {editId ? 'Edit Painting' : 'Add New Painting'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Medium</label>
                  <input
                    name="medium"
                    value={form.medium}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Size</label>
                  <input
                    name="size"
                    value={form.size}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Images</label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={e => {
                      const files = Array.from(e.target.files);
                      setForm(f => ({ ...f, images: (f.images || []).concat(files) }));
                    }}
                    className="flex-1 px-3 py-2 border rounded"
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
                {/* Preview selected images */}
                {form.images && form.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.images.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                          alt="preview"
                          className="h-16 w-16 object-cover rounded border"
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs opacity-80 group-hover:opacity-100"
                          onClick={() => {
                            setForm(f => ({ ...f, images: f.images.filter((_, i) => i !== idx) }));
                            toast.info('Image will be removed when you save');
                          }}
                          title="Remove"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="flex gap-4 mt-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isAvailable"
                    name="isAvailable"
                    checked={form.isAvailable}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isAvailable" className="ml-2 block text-sm text-gray-900">
                    In Stock
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    name="isFeatured"
                    checked={form.isFeatured}
                    onChange={handleChange}
                    className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-900">
                    Featured Painting
                  </label>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-green-500 text-white rounded hover:bg-green-600 btn-animate"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Gallery Modal */}
      {showGallery && galleryImages.length > 0 && (
        <ImageGalleryPopup
          images={galleryImages}
          currentIdx={galleryIdx}
          setCurrentIdx={setGalleryIdx}
          onClose={() => setShowGallery(false)}
        />
      )}
      
      {/* Media Gallery Selection Modal */}
      {showMediaGallery && (
        <MediaGalleryModal
          onClose={() => setShowMediaGallery(false)}
          onSelect={(selectedMedia) => {
            // Handle multiple image selection and ensure proper URL format
            const processUrl = (url) => {
              // If it's a relative URL (starts with /uploads), add the backend URL
              if (url && url.startsWith('/uploads/')) {
                const backendUrl = process.env.NODE_ENV === 'production'
                  ? 'https://your-production-api-url.com'
                  : 'http://localhost:5000';
                return `${backendUrl}${url}`;
              }
              return url;
            };
            
            const newImages = Array.isArray(selectedMedia) 
              ? selectedMedia.map(item => processUrl(item.url))
              : [processUrl(selectedMedia.url)];
              
            console.log('Selected images:', newImages);
              
            setForm(f => ({
              ...f,
              images: [...f.images, ...newImages]
            }));
            setShowMediaGallery(false);
            toast.success(`${newImages.length} image${newImages.length === 1 ? '' : 's'} selected from gallery`);
          }}
          maxSelect={5} // Allow multiple image selection
        />
      )}
    </motion.div>
  );
};

export default PaintingsContent;
