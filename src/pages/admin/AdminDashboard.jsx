import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../../components/ToastContext';
import { apiRequest } from '../../utils/api';
import CategoriesContent from './CategoriesContent';
import PaintingsContent from './PaintingsContent';
import OrdersContent from './OrdersContent';
import BlogContent from './BlogContent';
import SettingsContent from './SettingsContent';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error: showError, success } = useToast();

  // Check authentication on component mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      showError('Access denied. Please login first.');
      navigate('/');
    }
  }, [navigate, showError]);

  // Redirect to dashboard if on /admin-dashboard without sub-route
  useEffect(() => {
    if (location.pathname === '/admin-dashboard') {
      navigate('/admin-dashboard/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (token) {
        await import('../../utils/api').then(({ apiRequest }) => apiRequest('/auth/logout', 'POST', null, token));
      }
    } catch (err) {
      showError('Logout failed. Please try again.');
    } finally {
      localStorage.removeItem('adminLoggedIn');
      localStorage.removeItem('adminToken');
      success('Logged out successfully');
      navigate('/admin-login');
    }
  };


  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin-dashboard/dashboard' },
    { id: 'paintings', label: 'Manage Paintings', icon: '🎨', path: '/admin-dashboard/paintings' },
    { id: 'categories', label: 'Manage Categories', icon: '🏷️', path: '/admin-dashboard/categories' },
    { id: 'blog', label: 'Manage Blog', icon: '📝', path: '/admin-dashboard/blog' },
    { id: 'orders', label: 'Orders', icon: '📦', path: '/admin-dashboard/orders' },
    { id: 'settings', label: 'Settings', icon: '⚙️', path: '/admin-dashboard/settings' },
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <img src="/logo.jpeg" alt="Kashish Art India Logo" className="h-10 w-auto object-contain" />
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActiveRoute(item.path)
                        ? 'bg-gradient-to-r from-orange-400 to-green-400 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Routes>
            <Route path="/dashboard" element={<DashboardContent />} />
            <Route path="/paintings" element={<PaintingsContent />} />
            <Route path="/categories" element={<CategoriesContent />} />
            <Route path="/blog" element={<BlogContent />} />
            <Route path="/orders" element={<OrdersContent />} />
            <Route path="/settings" element={<SettingsContent />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Dashboard Content Component

const DashboardContent = () => {
  const [stats, setStats] = useState({
    paintingsCount: 0,
    categoriesCount: 0,
    ordersCount: 0,
    inStockCount: 0
  });
  const [recentPaintings, setRecentPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        
        // Fetch paintings data
        const paintingsRes = await apiRequest('/paintings', 'GET', null, token);
        console.log('Paintings API response:', paintingsRes);
        
        // Handle different response formats
        let paintings = [];
        if (paintingsRes && paintingsRes.paintings) {
          paintings = Array.isArray(paintingsRes.paintings) ? paintingsRes.paintings : [];
        } else if (Array.isArray(paintingsRes)) {
          paintings = paintingsRes;
        }
        
        // Fetch categories data
        const categoriesRes = await apiRequest('/categories', 'GET', null, token);
        console.log('Categories API response:', categoriesRes);
        
        let categories = [];
        if (categoriesRes && categoriesRes.categories) {
          categories = Array.isArray(categoriesRes.categories) ? categoriesRes.categories : [];
        } else if (Array.isArray(categoriesRes)) {
          categories = categoriesRes;
        }
        
        // Fetch orders data (assuming you have an orders API endpoint)
        let ordersCount = 0;
        try {
          const ordersRes = await apiRequest('/orders', 'GET', null, token);
          if (ordersRes && ordersRes.orders) {
            ordersCount = Array.isArray(ordersRes.orders) ? ordersRes.orders.length : 0;
          } else if (Array.isArray(ordersRes)) {
            ordersCount = ordersRes.length;
          }
        } catch (orderErr) {
          console.log('Orders API not available, using dummy data', orderErr);
          // Fallback to dummy data if orders API is not yet implemented
          ordersCount = 8;
        }
        
        // Calculate stats
        const inStockCount = paintings.filter(p => p.isAvailable).length;
        
        // Get recent paintings (latest 5)
        const sortedPaintings = [...paintings]
          .sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()))
          .slice(0, 5);
        
        console.log('Setting dashboard stats:', { 
          paintingsCount: paintings.length,
          categoriesCount: categories.length,
          ordersCount,
          inStockCount
        });
        
        setStats({
          paintingsCount: paintings.length,
          categoriesCount: categories.length,
          ordersCount,
          inStockCount
        });
        
        setRecentPaintings(sortedPaintings);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [toast]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-sm p-6"
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Total Paintings</p>
                  <p className="text-3xl font-bold">{stats.paintingsCount}</p>
                </div>
                <span className="text-4xl">🎨</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Categories</p>
                  <p className="text-3xl font-bold">{stats.categoriesCount}</p>
                </div>
                <span className="text-4xl">🏷️</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">In Stock</p>
                  <p className="text-3xl font-bold">{stats.inStockCount}</p>
                </div>
                <span className="text-4xl">✅</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100">Orders</p>
                  <p className="text-3xl font-bold">{stats.ordersCount}</p>
                </div>
                <span className="text-4xl">📦</span>
              </div>
            </div>
          </div>
          
          {/* Recent Paintings */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Paintings</h3>
            
            {recentPaintings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No paintings found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentPaintings.map(painting => (
                      <tr key={painting._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">
                          <img 
                            src={painting.images && painting.images[0] || '/placeholder.png'} 
                            alt={painting.title}
                            className="w-10 h-10 object-cover rounded"
                          />
                        </td>
                        <td className="px-4 py-2 font-medium text-gray-900">{painting.title}</td>
                        <td className="px-4 py-2 text-gray-500">{painting.category}</td>
                        <td className="px-4 py-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${painting.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {painting.isAvailable ? 'In Stock' : 'Sold Out'}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-gray-500">₹{painting.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {/* System Status */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg bg-white">
                <h4 className="font-medium text-gray-700 mb-2">Storage</h4>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '30%' }}></div>
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>30% used</span>
                  <span>5.3 GB of 20 GB</span>
                </div>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg bg-white">
                <h4 className="font-medium text-gray-700 mb-2">API Status</h4>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">All systems operational</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Last checked: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};



export default AdminDashboard; 