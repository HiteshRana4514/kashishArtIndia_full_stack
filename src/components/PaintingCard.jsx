import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const PaintingCard = ({ painting, onBuyNow }) => {
  const navigate = useNavigate();
  // Handle case where painting might not have all properties
  const {
    title = '',
    category = '',
    medium = '',
    size = '',
    price = 0,
    description = '',
    images = [],
    isAvailable = true,
    isFeatured = false
  } = painting || {};
  
  // Get the main image URL from the images array
  const imageUrl = images && images.length > 0 ? images[0] : painting.image || ''; // fallback to old format if needed
  // Handle card click to navigate to product details
  const handleCardClick = (e) => {
    // Prevent navigation if clicking the Buy Now button
    if (e.target.closest('.btn-primary')) {
      return;
    }
    navigate(`/products/${painting._id}`);
  };

  return (
    <div 
      className="card group cursor-pointer bg-white rounded-lg overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-xl shadow-md transform hover:-translate-y-1" 
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
          }}
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
            category === 'Landscape' ? 'bg-kashish-green' :
            category === 'Portrait' ? 'bg-kashish-red' :
            category === 'Abstract' ? 'bg-kashish-blue' :
            'bg-gray-600'
          }`}>
            {category}
          </span>
          {isFeatured && (
            <span className="px-3 py-1 rounded-full text-xs font-medium text-white bg-orange-500">
              Featured
            </span>
          )}
        </div>
      </div>
      
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-kashish-blue transition-colors line-clamp-2 min-h-[3.5rem]">
          {title}
        </h3>
        <div className="flex flex-wrap gap-2 text-sm text-gray-500 mb-2">
          <span><strong>Medium:</strong> {medium || 'Not specified'}</span>
          {size && <span><strong>Size:</strong> {size}</span>}
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2 flex-grow">
          {description}
        </p>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div>
            <span className="text-2xl font-bold text-kashish-blue">
              ₹{price.toLocaleString()}
            </span>
            <div className="mt-1">
              {isAvailable ? (
                <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-1 rounded">
                  In Stock
                </span>
              ) : (
                <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-1 rounded">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card navigation
              onBuyNow(painting);
            }}
            className={`btn-primary hover:shadow-lg ${!isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isAvailable}
          >
            {isAvailable ? 'Buy Now' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaintingCard 