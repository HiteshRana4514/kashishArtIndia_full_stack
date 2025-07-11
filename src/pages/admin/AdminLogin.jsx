import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { motion } from 'framer-motion';
import { useToast } from '../../components/ToastContext';
import { apiRequest } from '../../utils/api';

// Initialize AOS
if (typeof window !== 'undefined') {
  AOS.init();
}

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focus, setFocus] = useState({ email: false, password: false });
  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiRequest('/auth/login', 'POST', { email, password });
      // Only allow admin login
      if (res.user && res.user.role === 'admin') {
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminToken', res.token);
        success('Login successful! Welcome to Admin Dashboard');
        navigate('/admin-dashboard');
      } else {
        setError('Access denied: Not an admin');
        showError('Access denied: Not an admin');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      showError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="hero-bg min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Floating Elements (same as hero section) */}
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>
      {/* Overlay for subtle darkening */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      <motion.form
        className="w-full max-w-md bg-white/90 rounded-xl shadow-xl p-8 flex flex-col gap-6 border border-orange-100 relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring' }}
        onSubmit={handleSubmit}
      >
        <motion.div
          className="flex justify-center mb-2"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, type: 'spring' }}
        >
          <img src="/logo.jpg" alt="Kashish Art India Logo" className="h-20 w-auto object-contain" />
        </motion.div>
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-2">Admin Login</h2>
        <div className="relative">
          <label className={`block text-sm font-medium mb-1 transition-all duration-200 ${focus.email ? 'text-orange-500' : 'text-gray-700'}`}>Email</label>
          <input
            type="email"
            className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none ${focus.email ? 'border-orange-400 ring-2 ring-orange-200 shadow-lg' : 'border-gray-300'}`}
            value={email}
            onChange={e => setEmail(e.target.value)}
            onFocus={() => setFocus(f => ({ ...f, email: true }))}
            onBlur={() => setFocus(f => ({ ...f, email: false }))}
            required
            autoFocus
          />
        </div>
        <div className="relative">
          <label className={`block text-sm font-medium mb-1 transition-all duration-200 ${focus.password ? 'text-orange-500' : 'text-gray-700'}`}>Password</label>
          <input
            type="password"
            className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none ${focus.password ? 'border-orange-400 ring-2 ring-orange-200 shadow-lg' : 'border-gray-300'}`}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={() => setFocus(f => ({ ...f, password: true }))}
            onBlur={() => setFocus(f => ({ ...f, password: false }))}
            required
          />
        </div>
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        <motion.button
          type="submit"
          className="w-full py-2 rounded-lg bg-gradient-to-r from-orange-400 to-green-400 text-white font-semibold shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
          whileHover={{ scale: 1.05, boxShadow: '0 4px 24px #fbbf24aa' }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          ) : null}
          {loading ? 'Logging in...' : 'Login'}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AdminLogin; 