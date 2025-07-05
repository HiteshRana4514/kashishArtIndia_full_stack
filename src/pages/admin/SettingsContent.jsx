import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/ToastContext';

const SettingsContent = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const toast = useToast();
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // Fetch admin profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          throw new Error('No authentication token found');
        }
        
        const response = await apiRequest('/auth/me', 'GET', null, token);
        if (response && response.data) {
          setProfile(response.data);
          setName(response.data.name || '');
          setEmail(response.data.email || '');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        toast.error('Failed to load profile information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [toast]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No authentication token found');
      
      // We'll just implement the UI for now as this would require an additional endpoint
      // This is a placeholder for the actual API call:
      // await apiRequest('/users/profile', 'PUT', { name, email }, token);
      
      // Update local state
      setProfile(prev => ({ ...prev, name, email }));
      toast.success('Profile updated successfully');
      setEditMode(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setUpdateLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Redirect to login if not authenticated
  const handleLoginRedirect = () => {
    window.location.href = '/admin/login';
  };

  // Show authentication error UI if not authenticated
  if (!isAuthenticated && !loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-xl shadow-sm p-8 text-center"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h.01M12 9V7m0 0V5m0 2h.01M20 12a8 8 0 11-16 0 8 8 0 0116 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Authentication Required</h2>
          <p className="text-gray-600 max-w-md">You need to be logged in to access the admin settings page. Please log in with your admin credentials.</p>
          <button 
            onClick={handleLoginRedirect}
            className="mt-4 px-6 py-2 bg-kashish-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Admin Profile Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Admin Profile</h2>
            {!editMode && (
              <button 
                onClick={() => setEditMode(true)}
                className="text-sm px-4 py-2 bg-kashish-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-kashish-blue rounded-full animate-spin"></div>
            </div>
          ) : profile ? (
            editMode ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-kashish-blue focus:border-kashish-blue" 
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-kashish-blue focus:border-kashish-blue" 
                    required
                  />
                </div>
                
                <div className="flex space-x-3 pt-2">
                  <button 
                    type="submit" 
                    disabled={updateLoading}
                    className="px-4 py-2 bg-kashish-green text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    {updateLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditMode(false);
                      setName(profile.name || '');
                      setEmail(profile.email || '');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Name</p>
                  <p className="text-gray-800 font-medium">{profile.name || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-800 font-medium">{profile.email || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Role</p>
                  <p className="text-gray-800 font-medium capitalize">{profile.role || 'N/A'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Login</p>
                  <p className="text-gray-800 font-medium">{formatDate(profile.lastLogin)}</p>
                </div>
              </div>
            )
          ) : (
            <p className="text-gray-600 py-4">Failed to load profile information.</p>
          )}
        </div>
        
        {/* Security Settings Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Security Settings</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Password</h3>
                <p className="text-gray-500 text-sm">Update your password regularly to keep your account secure</p>
              </div>
              <button 
                onClick={() => setPasswordModalOpen(true)}
                className="px-4 py-2 bg-kashish-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Change Password
              </button>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Two-Factor Authentication</h3>
                <p className="text-gray-500 text-sm">Add an extra layer of security to your account</p>
              </div>
              <span className="text-gray-500 text-sm italic">Coming Soon</span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Login History</h3>
                <p className="text-gray-500 text-sm">View your recent login activity</p>
              </div>
              <span className="text-gray-500 text-sm italic">Coming Soon</span>
            </div>
          </div>
        </div>
        
        {/* Store Settings (placeholder) */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Store Settings</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Store Information</h3>
                <p className="text-gray-500 text-sm">Update your store details, contact information, and policies</p>
              </div>
              <span className="text-gray-500 text-sm italic">Coming Soon</span>
            </div>
            
            <div className="flex justify-between items-center pb-3 border-b border-gray-100">
              <div>
                <h3 className="text-lg font-medium text-gray-800">Payment Options</h3>
                <p className="text-gray-500 text-sm">Configure payment methods and processing options</p>
              </div>
              <span className="text-gray-500 text-sm italic">Coming Soon</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Password Change Modal */}
      {passwordModalOpen && (
        <PasswordChangeModal 
          onClose={() => setPasswordModalOpen(false)} 
        />
      )}
    </>
  );
};

// Password Change Modal Component
const PasswordChangeModal = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const toast = useToast();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) throw new Error('No authentication token found');
      
      await apiRequest('/auth/change-password', 'PUT', {
        currentPassword,
        newPassword
      }, token);
      
      toast.success('Password changed successfully');
      onClose();
    } catch (error) {
      console.error('Failed to change password:', error);
      const errorMessage = error.message === 'Current password is incorrect' 
        ? 'Current password is incorrect' 
        : 'Failed to change password';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Change Password</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <div className="relative">
              <input 
                type={showCurrentPassword ? "text" : "password"} 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-kashish-blue focus:border-kashish-blue pr-10" 
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowCurrentPassword(prev => !prev)}
              >
                {showCurrentPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input 
                type={showNewPassword ? "text" : "password"} 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-kashish-blue focus:border-kashish-blue pr-10" 
                required
                minLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowNewPassword(prev => !prev)}
              >
                {showNewPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-kashish-blue focus:border-kashish-blue pr-10" 
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowConfirmPassword(prev => !prev)}
              >
                {showConfirmPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          <div className="flex space-x-3 pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 px-4 py-2 bg-kashish-blue text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
            
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsContent;
