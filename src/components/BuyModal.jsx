import { useState, useEffect } from 'react';
import { apiRequest } from '../utils/api';

const BuyModal = ({ isOpen, onClose, painting }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    message: ''
  });
  
  // Update message when painting changes
  useEffect(() => {
    if (painting?.title) {
      setFormData(prevState => ({
        ...prevState,
        message: `I want to buy this painting: ${painting.title}`
      }));
    }
  }, [painting]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false)

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess(false);
    
    try {
      // Log the painting object to help with debugging
      console.log('Painting data being submitted:', painting);
      
      // Create order with detailed painting and customer information
      const orderData = {
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address
        },
        paintingId: painting._id,
        paintingDetails: {
          title: painting.title || '',
          price: painting.price || 0,
          category: painting.category || '',
          categoryName: painting.categoryName || painting.category || '',
          medium: painting.medium || '',
          dimensions: painting.dimensions || painting.size || '',
          image: painting.image || '',
          artist: painting.artist || 'Kashish Art India'
        },
        message: formData.message,
        totalAmount: painting.price || 0
      };
      
      // Log the complete order data being sent
      console.log('Order data being submitted:', orderData);
      
      const response = await apiRequest('/orders', 'POST', orderData);
      console.log('Order created:', response);
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        // Reset form data
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'India'
          },
          message: ''
        });
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to create order:', err);
      setError('Failed to send your request. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle nested fields (for address object)
    if (name.includes('.')) {
      const [parentField, childField] = name.split('.');
      setFormData({
        ...formData,
        [parentField]: {
          ...formData[parentField],
          [childField]: value
        }
      });
    } else {
      // Handle top-level fields
      setFormData({
        ...formData,
        [name]: value
      });
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Purchase Request</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {painting && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                {painting.image && (
                  <img
                    src={painting.image}
                    alt={painting.title || 'Painting'}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/placeholder-art.jpg';
                    }}
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{painting.title || 'Untitled'}</h3>
                  <p className="text-sm text-gray-600">Category: {painting.category || painting.categoryName || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Medium: {painting.medium || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Size: {painting.dimensions || painting.size || 'N/A'}</p>
                  <p className="text-lg font-bold text-kashish-blue">
                    ₹{typeof painting.price === 'number' ? painting.price.toLocaleString() : 'Price on request'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg">
              Thank you for your interest! Your purchase request has been submitted successfully. We will contact you soon.
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={submitting || success}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kashish-blue focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={submitting || success}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kashish-blue focus:border-transparent"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={submitting || success}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kashish-blue focus:border-transparent"
                placeholder="Enter your mobile number"
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Address
              </label>
              <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                <div className="mb-3">
                  <label htmlFor="street" className="block text-xs text-gray-600 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    required
                    disabled={submitting || success}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-kashish-blue focus:border-transparent"
                    placeholder="House/Flat No., Building, Street"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label htmlFor="city" className="block text-xs text-gray-600 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      required
                      disabled={submitting || success}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-kashish-blue focus:border-transparent"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-xs text-gray-600 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      required
                      disabled={submitting || success}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-kashish-blue focus:border-transparent"
                      placeholder="State"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="zipCode" className="block text-xs text-gray-600 mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                      required
                      disabled={submitting || success}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-kashish-blue focus:border-transparent"
                      placeholder="PIN Code"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-xs text-gray-600 mb-1">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      disabled={submitting || success}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-kashish-blue focus:border-transparent bg-gray-100"
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="3"
                disabled={submitting || success}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kashish-blue focus:border-transparent"
                placeholder="Additional message (optional)"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                {success ? 'Close' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={submitting || success}
                className="flex-1 btn-primary relative disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <span className="invisible">Send Request</span>
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </span>
                  </>
                ) : 'Send Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BuyModal 