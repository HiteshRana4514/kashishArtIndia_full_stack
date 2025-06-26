import React, { useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '../../components/ToastContext';

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

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    success('Logged out successfully');
    navigate('/admin-login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/admin-dashboard/dashboard' },
    { id: 'paintings', label: 'Manage Paintings', icon: '🎨', path: '/admin-dashboard/paintings' },
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
const DashboardContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-xl shadow-sm p-6"
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100">Total Paintings</p>
            <p className="text-3xl font-bold">24</p>
          </div>
          <span className="text-4xl">🎨</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100">Blog Posts</p>
            <p className="text-3xl font-bold">12</p>
          </div>
          <span className="text-4xl">📝</span>
        </div>
      </div>
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-orange-100">Total Orders</p>
            <p className="text-3xl font-bold">8</p>
          </div>
          <span className="text-4xl">📦</span>
        </div>
      </div>
    </div>
    <div className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
      <div className="space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-gray-600">New painting "Sunset Valley" added</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-gray-600">Blog post "Art of Landscape" published</span>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span className="text-gray-600">New order received for "Mountain View"</span>
        </div>
      </div>
    </div>
  </motion.div>
);

// Paintings Content Component
const PaintingsContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-xl shadow-sm p-6"
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Paintings</h2>
    <p className="text-gray-600">Painting management interface will be implemented here.</p>
  </motion.div>
);

// Blog Content Component
const BlogContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-xl shadow-sm p-6"
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Manage Blog</h2>
    <p className="text-gray-600">Blog management interface will be implemented here.</p>
  </motion.div>
);

// Orders Content Component
const OrdersContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-xl shadow-sm p-6"
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Orders</h2>
    <p className="text-gray-600">Order management interface will be implemented here.</p>
  </motion.div>
);

// Settings Content Component
const SettingsContent = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="bg-white rounded-xl shadow-sm p-6"
  >
    <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>
    <p className="text-gray-600">Admin settings interface will be implemented here.</p>
  </motion.div>
);

export default AdminDashboard; 