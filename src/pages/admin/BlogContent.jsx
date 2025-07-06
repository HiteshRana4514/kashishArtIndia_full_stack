import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '../../components/ToastContext';
import { apiRequest } from '../../utils/api';
import BlogEditorModal from '../../components/BlogEditorModal';

const BlogContent = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentBlog, setCurrentBlog] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingBlog, setDeletingBlog] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const toast = useToast();

  useEffect(() => {
    fetchBlogs();
  }, [currentPage]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      // Fixed API endpoint path to match the server.js route configuration
      const response = await apiRequest(`/blogs?page=${currentPage}${searchTerm ? `&search=${searchTerm}` : ''}`, 'GET', null, token);
      
      if (response.success) {
        setBlogs(response.data);
        setTotalPages(response.pagination.totalPages);
      } else {
        toast.error('Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Error loading blogs');
    } finally {
      setLoading(false);
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsSearching(true);
    setCurrentPage(1);
    fetchBlogs();
  };

  const handleAddNew = () => {
    setCurrentBlog(null);
    setShowAddModal(true);
  };

  const handleEdit = (blog) => {
    setCurrentBlog(blog);
    setShowAddModal(true);
  };

  const handleDelete = (blog) => {
    setDeletingBlog(blog);
    setShowDeleteModal(true);
  };

  const handleTogglePublish = async (blog) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await apiRequest(`/blogs/${blog._id}/publish`, 'PATCH', null, token);
      
      if (response.success) {
        toast.success(`Blog ${response.data.isPublished ? 'published' : 'unpublished'} successfully`);
        // Update the blog in the local state
        setBlogs(blogs.map(b => b._id === blog._id ? response.data : b));
      } else {
        toast.error('Failed to update blog status');
      }
    } catch (error) {
      console.error('Error updating blog status:', error);
      toast.error('Error updating blog status');
    }
  };

  const confirmDelete = async () => {
    if (!deletingBlog) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await apiRequest(`/blogs/${deletingBlog._id}`, 'DELETE', null, token);
      
      if (response.success) {
        toast.success('Blog deleted successfully');
        setBlogs(blogs.filter(blog => blog._id !== deletingBlog._id));
        setShowDeleteModal(false);
        setDeletingBlog(null);
      } else {
        toast.error('Failed to delete blog');
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Error deleting blog');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Blog Management</h2>
            <button
              onClick={handleAddNew}
              className="bg-kashish-blue text-white px-4 py-2 rounded-lg flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Blog
            </button>
          </div>
          
          {/* Search and filters */}
          <div className="mb-6">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search blogs..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-kashish-blue focus:border-kashish-blue"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
                disabled={isSearching}
              >
                {isSearching ? (
                  <svg className="animate-spin h-5 w-5 text-kashish-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>
            </form>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <svg className="animate-spin h-8 w-8 text-kashish-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No blogs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'No blogs match your search criteria.' : 'Get started by creating a new blog post.'}
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleAddNew}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-kashish-blue hover:bg-blue-700"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Blog Post
                </button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto w-full" style={{maxWidth: '100%'}}>
              <table className="min-w-full divide-y divide-gray-200 table-fixed" style={{minWidth: '800px'}}>
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{width: '30%'}}>
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{width: '25%'}}>
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{width: '25%'}}>
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{width: '20%'}}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {blogs.map(blog => (
                    <tr key={blog._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img 
                              className="h-10 w-10 rounded-full object-cover" 
                              src={blog.coverImage ? blog.coverImage : 'https://via.placeholder.com/150'} 
                              alt={blog.title} 
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{blog.summary}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${blog.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleTogglePublish(blog)}
                            className={`px-2 py-1 rounded ${blog.isPublished ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                          >
                            {blog.isPublished ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleEdit(blog)}
                            className="px-2 py-1 bg-blue-100 text-blue-700 rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(blog)}
                            className="px-2 py-1 bg-red-100 text-red-700 rounded"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {!loading && blogs.length > 0 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 rounded-md mr-2 bg-gray-100 disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="text-sm">
                  Page {currentPage} of {totalPages}
                </div>
                <button
                  onClick={() => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev))}
                  disabled={currentPage >= totalPages}
                  className="px-3 py-1 rounded-md ml-2 bg-gray-100 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </div>
      </motion.div>

      {/* Blog Editor Modal component will go here */}
      {showAddModal && (
        <BlogEditorModal 
          blog={currentBlog} 
          onClose={() => setShowAddModal(false)} 
          onSave={(savedBlog) => {
            setShowAddModal(false);
            toast.success(`Blog ${currentBlog ? 'updated' : 'created'} successfully`);
            fetchBlogs();
          }} 
        />
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && deletingBlog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Blog Post</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete the blog post "{deletingBlog.title}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeletingBlog(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogContent;
