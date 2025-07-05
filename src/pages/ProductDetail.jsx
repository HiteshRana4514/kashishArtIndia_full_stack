import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';
import BuyModal from '../components/BuyModal';

const ProductDetail = () => {
  const { id } = useParams();
  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [copySuccess, setCopySuccess] = useState(false);
  
  // Tooltip states for each share option
  const [showTooltips, setShowTooltips] = useState({
    facebook: false,
    twitter: false,
    pinterest: false,
    whatsapp: false,
    copyLink: false
  });

  // Fetch painting details
  useEffect(() => {
    const fetchPaintingDetails = async () => {
      setLoading(true);
      try {
        const response = await apiRequest(`/paintings/${id}`, 'GET');
        setPainting(response);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch painting details:', err);
        setError('Failed to load painting details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPaintingDetails();
    }
  }, [id]);

  const handleBuyNow = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  
  // Function to copy current URL to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      
      // Reset success message after 2 seconds
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy URL: ', err);
    }
  };

  // Generate shareable URL for the current page
  const shareUrl = window.location.href;
  const shareTitle = painting ? `Check out "${painting.title}" painting` : "Check out this beautiful painting";

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !painting) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-4">
        <div className="text-center max-w-xl">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            {error || "Painting not found"}
          </h1>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't find the painting you're looking for.
          </p>
          <Link to="/products" className="btn-primary">
            Return to All Paintings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex text-sm text-gray-500">
            <li>
              <Link to="/" className="hover:text-kashish-blue">Home</Link>
            </li>
            <li className="mx-2">/</li>
            <li>
              <Link to="/products" className="hover:text-kashish-blue">Paintings</Link>
            </li>
            <li className="mx-2">/</li>
            <li className="text-gray-800 font-medium truncate">
              {painting.title}
            </li>
          </ol>
        </nav>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Gallery */}
            <div className="p-6 lg:p-8">
              <div className="mb-4">
                <div className="relative pb-[100%] rounded-lg overflow-hidden">
                  <img 
                    src={painting.images?.[activeImage] || painting.image} 
                    alt={painting.title} 
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                </div>
              </div>
              {/* Thumbnail Gallery */}
              {painting.images && painting.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {painting.images.map((img, index) => (
                    <div 
                      key={index} 
                      className={`cursor-pointer border-2 rounded overflow-hidden ${activeImage === index ? 'border-kashish-blue' : 'border-gray-200'}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <div className="pb-[100%] relative">
                        <img 
                          src={img} 
                          alt={`${painting.title} - view ${index + 1}`} 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-6 lg:p-8 flex flex-col">
              {/* Status and Category */}
              <div className="flex gap-2 mb-4">
                {painting.category && (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${ 
                    painting.category === 'Landscape' ? 'bg-kashish-green' :
                    painting.category === 'Portrait' ? 'bg-kashish-red' :
                    painting.category === 'Abstract' ? 'bg-kashish-blue' :
                    'bg-gray-600'
                  }`}>
                    {painting.category}
                  </span>
                )}
                {painting.isFeatured && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium text-white bg-orange-500">
                    Featured
                  </span>
                )}
                {painting.isAvailable ? (
                  <span className="px-3 py-1 rounded-full text-xs font-medium text-green-600 bg-green-100">
                    In Stock
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Title and Price */}
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {painting.title}
              </h1>
              <div className="text-3xl font-bold text-kashish-blue mb-6">
                ₹{painting.price?.toLocaleString()}
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 gap-y-4 text-gray-600 mb-8">
                {painting.artist && (
                  <>
                    <div className="font-medium">Artist</div>
                    <div>{painting.artist}</div>
                  </>
                )}
                {painting.medium && (
                  <>
                    <div className="font-medium">Medium</div>
                    <div>{painting.medium}</div>
                  </>
                )}
                {painting.size && (
                  <>
                    <div className="font-medium">Size</div>
                    <div>{painting.size}</div>
                  </>
                )}
                {painting.year && (
                  <>
                    <div className="font-medium">Year</div>
                    <div>{painting.year}</div>
                  </>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="font-medium text-lg text-gray-800 mb-2">Description</h3>
                <p className="text-gray-600">
                  {painting.description || "No description available for this artwork."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-auto">
                <div className="flex flex-wrap gap-4 mb-6">
                  <button
                    onClick={handleBuyNow}
                    disabled={!painting.isAvailable}
                    className={`px-8 py-3 bg-kashish-blue text-white rounded-lg font-medium flex-1 flex items-center justify-center ${!painting.isAvailable ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                  >
                    {painting.isAvailable ? 'Buy Now' : 'Sold Out'}
                  </button>
                  <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <svg className="w-5 h-5 text-gray-400 hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </button>
                </div>

                {/* Share Section */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-kashish-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                    </svg>
                    Share this painting
                  </h3>
                  <div className="flex gap-3">
                    <div className="relative">
                      <a 
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 w-8 h-8 flex items-center justify-center"
                        aria-label="Share on Facebook"
                        onMouseEnter={() => setShowTooltips({...showTooltips, facebook: true})}
                        onMouseLeave={() => setShowTooltips({...showTooltips, facebook: false})}
                      >
                        <span className="text-xs font-bold">f</span>
                      </a>
                      {showTooltips.facebook && (
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                          Share on Facebook
                        </span>
                      )}
                    </div>
                    
                    <div className="relative">
                      <a 
                        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 w-8 h-8 flex items-center justify-center"
                        aria-label="Share on Twitter"
                        onMouseEnter={() => setShowTooltips({...showTooltips, twitter: true})}
                        onMouseLeave={() => setShowTooltips({...showTooltips, twitter: false})}
                      >
                        <span className="text-xs font-bold">X</span>
                      </a>
                      {showTooltips.twitter && (
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                          Share on Twitter
                        </span>
                      )}
                    </div>
                    
                    <div className="relative">
                      <a 
                        href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&media=${encodeURIComponent(painting.images?.[0] || '')}&description=${encodeURIComponent(shareTitle)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 w-8 h-8 flex items-center justify-center"
                        aria-label="Share on Pinterest"
                        onMouseEnter={() => setShowTooltips({...showTooltips, pinterest: true})}
                        onMouseLeave={() => setShowTooltips({...showTooltips, pinterest: false})}
                      >
                        <span className="text-xs font-bold">P</span>
                      </a>
                      {showTooltips.pinterest && (
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                          Share on Pinterest
                        </span>
                      )}
                    </div>
                    
                    <div className="relative">
                      <a 
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 w-8 h-8 flex items-center justify-center"
                        aria-label="Share on WhatsApp"
                        onMouseEnter={() => setShowTooltips({...showTooltips, whatsapp: true})}
                        onMouseLeave={() => setShowTooltips({...showTooltips, whatsapp: false})}
                      >
                        <span className="text-xs font-bold">W</span>
                      </a>
                      {showTooltips.whatsapp && (
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                          Share on WhatsApp
                        </span>
                      )}
                    </div>
                    
                    <div className="relative">
                      <button
                        onClick={copyToClipboard}
                        className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-800 w-8 h-8 flex items-center justify-center"
                        aria-label="Copy link"
                        onMouseEnter={() => setShowTooltips({...showTooltips, copyLink: true})}
                        onMouseLeave={() => setShowTooltips({...showTooltips, copyLink: false})}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                        </svg>
                      </button>
                      {(showTooltips.copyLink || copySuccess) && (
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10">
                          {copySuccess ? 'Copied!' : 'Copy Link'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Related Paintings Section - Can be added later */}
      </div>

      {/* Buy Modal */}
      <BuyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        painting={painting}
      />
    </div>
  );
};

export default ProductDetail;
