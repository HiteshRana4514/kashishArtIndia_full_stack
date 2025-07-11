import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/ToastContext';

const OrdersContent = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const toast = useToast();

  // Status options for orders
  const statusOptions = [
    { value: 'new', label: 'New', color: 'blue' },
    { value: 'pending', label: 'Pending', color: 'amber' },
    { value: 'completed', label: 'Completed', color: 'green' },
    { value: 'rejected', label: 'Rejected', color: 'red' }
  ];

  // Fetch orders data
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          console.error('Admin token not found');
          setError('Authentication required. Please log in again.');
          setLoading(false);
          return;
        }
        
        const response = await apiRequest('/orders', 'GET', null, token);
        
        let ordersData = [];
        if (Array.isArray(response)) {
          ordersData = response;
        } else if (response && Array.isArray(response.orders)) {
          ordersData = response.orders;
        } else {
          // Fallback to empty array if response format is unexpected
          console.warn('Unexpected orders response format:', response);
          setError('Received unexpected data format from server');
        }
        
        // Process orders data to ensure painting details are complete
        const processedOrders = ordersData.map(order => {
          // Ensure paintingDetails exists and has expected properties
          if (!order.paintingDetails) {
            order.paintingDetails = {};
          }
          
          return order;
        });
        
        setOrders(processedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(`Failed to load orders: ${err.message || 'Unknown error'}`);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle order status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      await apiRequest(`/orders/${orderId}/status`, 'PATCH', { status: newStatus }, token);
      
      // Update local state
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      toast.error('Failed to update order status');
    }
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  // Handle order deletion
  const confirmDeleteOrder = (order) => {
    setOrderToDelete(order);
    setShowDeleteConfirmModal(true);
  };

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      const token = localStorage.getItem('adminToken');
      await apiRequest(`/orders/${orderToDelete._id}`, 'DELETE', null, token);
      
      // Remove from local state
      setOrders(orders.filter(order => order._id !== orderToDelete._id));
      
      toast.success(`Order has been deleted successfully`);
      setShowDeleteConfirmModal(false);
      setOrderToDelete(null);
    } catch (err) {
      console.error('Error deleting order:', err);
      toast.error(`Failed to delete order: ${err.message || 'Unknown error'}`);
    }
  };
  
  // Filter orders by status and search query
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = !statusFilter || order.status === statusFilter;
      
      const matchesSearch = !searchQuery || 
        ((order.customer && order.customer.name) || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        ((order.paintingDetails && order.paintingDetails.title) || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        ((order.customer && order.customer.email) || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order._id || '').toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [orders, statusFilter, searchQuery]);

  // Get status color
  const getStatusColor = (status) => {
    const statusOption = statusOptions.find(option => option.value === status);
    return statusOption ? statusOption.color : 'gray';
  };

  // Order details modal
  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;
    
    
    // Format the painting details with fallbacks
    const paintingDetails = selectedOrder.paintingDetails || {};
    
    // Extract painting details with fallbacks
    const paintingTitle = paintingDetails.title || 'N/A';
    const paintingCategory = paintingDetails.categoryName || paintingDetails.category || 'N/A';
    const paintingPrice = paintingDetails.price || selectedOrder.totalAmount || 0;
    const paintingDimensions = paintingDetails.dimensions || paintingDetails.size || 'N/A';
    const paintingMedium = paintingDetails.medium || 'N/A';
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header with order ID and close button */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 flex justify-between items-center text-white">
            <div>
              <h3 className="text-xl font-semibold">Order Details</h3>
              <p className="text-xs font-mono opacity-80 mt-1">ID: {selectedOrder._id}</p>
            </div>
            <button 
              onClick={() => setShowDetailsModal(false)}
              className="text-white hover:text-gray-200 focus:outline-none bg-white bg-opacity-20 rounded-full p-2"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Order status banner */}
          <div className={`px-6 py-2 bg-${getStatusColor(selectedOrder.status)}-50 border-b border-${getStatusColor(selectedOrder.status)}-100`}>
            <div className="flex items-center">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-${getStatusColor(selectedOrder.status)}-100 text-${getStatusColor(selectedOrder.status)}-800 mr-2`}>
                {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
              </span>
              <span className="text-sm text-gray-600">
                Ordered on {new Date(selectedOrder.createdAt).toLocaleDateString()} at {new Date(selectedOrder.createdAt).toLocaleTimeString()}
              </span>
              <span className="ml-auto font-medium text-gray-900">
                ₹{selectedOrder.totalAmount?.toLocaleString() || 'N/A'}
              </span>
            </div>
          </div>
          
          {/* Content area */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer information */}
              <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <h4 className="font-medium text-gray-700">Customer Information</h4>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex">
                    <span className="text-gray-500 w-20">Name:</span>
                    <span className="font-medium">{selectedOrder.customer?.name || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-20">Email:</span>
                    <span>{selectedOrder.customer?.email || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-20">Phone:</span>
                    <span>{selectedOrder.customer?.phone || 'N/A'}</span>
                  </div>
                  <div className="flex">
                    <span className="text-gray-500 w-20">Address:</span>
                    <span>{
                      selectedOrder.customer?.address ? (
                        typeof selectedOrder.customer.address === 'string' ? 
                          selectedOrder.customer.address : 
                          `${selectedOrder.customer.address.street || ''}, 
                          ${selectedOrder.customer.address.city || ''}, 
                          ${selectedOrder.customer.address.state || ''} 
                          ${selectedOrder.customer.address.zipCode || ''}, 
                          ${selectedOrder.customer.address.country || ''}`.replace(/\s+/g, ' ').trim()
                      ) : 'N/A'
                    }</span>
                  </div>
                </div>
              </div>
              
              {/* Painting Details with image */}
              <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                <div className="bg-gray-50 px-4 py-2 border-b">
                  <h4 className="font-medium text-gray-700">Painting Details</h4>
                </div>
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {selectedOrder.paintingDetails?.image && (
                      <img 
                        src={selectedOrder.paintingDetails.image} 
                        alt={selectedOrder.paintingDetails.title} 
                        className="h-32 w-32 object-cover rounded-md border"
                      />
                    )}
                    <div className="space-y-2 flex-1">
                      <div className="flex">
                        <span className="text-gray-500 w-24">Title:</span>
                        <span className="font-medium">{paintingTitle}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-24">Category:</span>
                        <span>{paintingCategory}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-24">Price:</span>
                        <span>₹{typeof paintingPrice === 'number' ? paintingPrice.toLocaleString() : paintingPrice}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-24">Dimensions:</span>
                        <span>{paintingDimensions}</span>
                      </div>
                      <div className="flex">
                        <span className="text-gray-500 w-24">Medium:</span>
                        <span>{paintingMedium}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Customer Message */}
              {selectedOrder.message && (
                <div className="md:col-span-2 bg-white border rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 border-b">
                    <h4 className="font-medium text-gray-700">Customer Message</h4>
                  </div>
                  <div className="p-4">
                    <p className="text-gray-800 italic">"{selectedOrder.message}"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer with action buttons */}
          <div className="px-6 py-4 bg-gray-50 border-t flex flex-col sm:flex-row justify-between gap-3">
            <div>
              <span className="text-sm font-medium text-gray-700">Update Status:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {statusOptions.map(option => (
                  <button
                    key={option.value}
                    onClick={() => {
                      handleStatusChange(selectedOrder._id, option.value);
                      setShowDetailsModal(false);
                    }}
                    disabled={selectedOrder.status === option.value}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${selectedOrder.status === option.value
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : `bg-${option.color}-100 text-${option.color}-800 hover:bg-${option.color}-200`
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setShowDetailsModal(false)}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-8 max-w-7xl mx-auto px-4"
    >
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Order Management</h1>
      
      {/* Filters and Search */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-medium">
            All Orders ({!loading ? filteredOrders.length : '...'})
          </h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="form-select rounded-md border-gray-300 shadow-sm focus:border-kashish-blue focus:ring-1 focus:ring-kashish-blue"
          >
            <option value="">All Statuses</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input pl-10 rounded-md border-gray-300 shadow-sm focus:border-kashish-blue focus:ring-1 focus:ring-kashish-blue w-full"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-10 text-center bg-white rounded-lg shadow">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-kashish-blue"></div>
          <p className="mt-3 text-gray-600">Loading orders...</p>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700 mb-4">
              <p>{error}</p>
            </div>
          )}

          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <p className="mt-4 text-gray-500 text-lg">
                {searchQuery || statusFilter ? "No matching orders found" : "No orders found"}
              </p>
              <p className="mt-2 text-gray-400">
                {searchQuery || statusFilter ? 
                  "Try adjusting your search or filter criteria." : 
                  "Orders will appear here once customers make painting inquiries."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full" style={{maxWidth: '100%'}}>
              <table className="min-w-full divide-y divide-gray-200 table-fixed" style={{minWidth: '900px'}}>
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{width: '15%'}}>
                      Order Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{width: '25%'}}>
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{width: '30%'}}>
                      Painting
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{width: '10%'}}>
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" style={{width: '20%'}}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.customer && order.customer.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{order.customer && order.customer.email || 'No email'}</div>
                        <div className="text-xs text-gray-400">{order.customer && order.customer.phone || ''}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.paintingDetails && order.paintingDetails.title || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">₹{order.totalAmount && order.totalAmount.toLocaleString() || '0'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View Details
                          </button>
                          <div className="relative group">
                            <button className="text-gray-600 hover:text-gray-900">
                              Change Status
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg hidden group-hover:block z-10">
                              {statusOptions.map(option => (
                                <button
                                  key={option.value}
                                  onClick={() => handleStatusChange(order._id, option.value)}
                                  disabled={order.status === option.value}
                                  className={`block w-full text-left px-4 py-2 text-sm ${
                                    order.status === option.value 
                                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                                      : 'hover:bg-gray-100 text-gray-700'
                                  }`}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => confirmDeleteOrder(order)}
                            className="text-red-600 hover:text-red-900"
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
        </div>
      )}
      
      {/* Order details modal */}
      {showDetailsModal && <OrderDetailsModal />}

      {/* Delete confirmation modal */}
      {showDeleteConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Order Deletion</h3>
            <p className="mb-4 text-gray-600">
              Are you sure you want to delete the order from {orderToDelete?.customer?.name || 'Unknown'}?
              <br /><br />
              <span className="font-medium">Painting:</span> {orderToDelete?.paintingDetails?.title || 'Unknown'}
              <br />
              <span className="font-medium">Order Date:</span> {orderToDelete ? new Date(orderToDelete.createdAt).toLocaleDateString() : ''}
              <br />
              <span className="font-medium">Status:</span> {orderToDelete?.status.charAt(0).toUpperCase() + orderToDelete?.status.slice(1)}
            </p>
            <div className="mt-5 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteConfirmModal(false);
                  setOrderToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default OrdersContent;
