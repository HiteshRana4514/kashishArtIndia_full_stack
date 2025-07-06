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
  let imageUrl = images && images.length > 0 ? images[0] : painting.image || ''; // fallback to old format if needed
  
  // Handle image URLs for both local and Cloudinary paths
  const transformImageUrl = (url) => {
    if (!url) return '';
    
    // For debugging
    console.log('Transforming URL:', url);
    
    // If it's already a full Cloudinary URL, use it as is
    if (url.startsWith('http') && url.includes('cloudinary.com')) {
      console.log('URL is already a Cloudinary URL');
      return url;
    }
    
    // If it's any other complete HTTP URL, use as is
    if (url.startsWith('http')) {
      console.log('URL is already a complete URL');
      return url;
    }
    
    // Handle Cloudinary partial URLs (v1234/folder/file)
    if (url.includes('kashish_art_india/')) {
      console.log('URL contains Cloudinary path pattern');
      return `https://res.cloudinary.com/dhshyzyak/image/upload/${url}`;
    }
    
    // For production backend URLs that include uploads/
    if (url.includes('/uploads/')) {
      console.log('Found /uploads/ URL in production');
      // In production, convert backend URLs to Cloudinary
      if (window.location.hostname !== 'localhost') {
        const fileName = url.split('/uploads/').pop();
        console.log('Extracted filename:', fileName);
        return `https://res.cloudinary.com/dhshyzyak/image/upload/v1/kashish_art_india/${fileName}`;
      }
      return url; // For development, keep as is
    }
    
    // For paths that START with uploads/ without leading slash
    if (url.startsWith('uploads/')) {
      console.log('URL starts with uploads/');
      // In production, rewrite to Cloudinary format
      if (window.location.hostname !== 'localhost') {
        const fileName = url.split('uploads/').pop();
        console.log('Extracted filename:', fileName);
        return `https://res.cloudinary.com/dhshyzyak/image/upload/v1/kashish_art_india/${fileName}`;
      } else {
        // In local development, keep as is but ensure proper path
        return url.startsWith('/') ? url : `/${url}`;
      }
    }
    
    // Default case - return as is
    console.log('Using URL as is');
    return url;
  };
  
  // Transform the URL
  imageUrl = transformImageUrl(imageUrl);
  
  // For debugging
  console.log('Transformed imageUrl:', imageUrl);
  console.log('Original painting data:', painting);
  
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