import { useState, useEffect } from 'react'
import { apiRequest } from '../utils/api'
import PaintingCard from '../components/PaintingCard'
import BuyModal from '../components/BuyModal'
import LoadingSpinner from '../components/LoadingSpinner'

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPainting, setSelectedPainting] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [paintings, setPaintings] = useState([])
  const [categories, setCategories] = useState(['All'])
  const [categoriesData, setCategoriesData] = useState([]) // Full category objects with descriptions, images
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  
  // Fetch paintings from API
  useEffect(() => {
    const fetchPaintings = async () => {
      setLoading(true)
      try {
        const response = await apiRequest('/paintings', 'GET')
        const paintingsData = response.paintings || response
        
        // Only show paintings that are available to buy (if not in admin mode)
        setPaintings(paintingsData)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch paintings:', err)
        setError('Failed to load paintings. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPaintings()
  }, [])
  
  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true)
      try {
        const response = await apiRequest('/categories', 'GET')
        const categoriesData = response.categories || response
        
        // Store full category objects for later use
        setCategoriesData(categoriesData)
        
        // Extract category names for the filter buttons
        const categoryNames = categoriesData.map(cat => cat.name)
        setCategories(['All', ...categoryNames])
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        // Don't show error for categories - fall back to painting-derived ones if needed
      } finally {
        setCategoriesLoading(false)
      }
    }
    
    fetchCategories()
  }, [])

  // Filter paintings by category and only show available ones for purchase
  const filteredPaintings = selectedCategory === 'All' 
    ? paintings.filter(painting => painting.isAvailable) 
    : paintings.filter(painting => painting.category === selectedCategory && painting.isAvailable)

  const handleBuyNow = (painting) => {
    setSelectedPainting(painting)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPainting(null)
  }

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          className="text-center mb-12"
          data-aos="fade-up"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Our Paintings Collection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our diverse collection of paintings, from breathtaking landscapes to expressive portraits and thought-provoking abstracts.
          </p>
        </div>

        {/* Category Filter */}
        <div 
          className="flex flex-wrap justify-center gap-4 mb-12"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-kashish-blue text-white scale-105'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200 hover:scale-105'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div 
          className="mb-8"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          {loading ? (
            <p className="text-gray-600">Loading paintings...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <p className="text-gray-600">
              Showing {filteredPaintings.length} painting{filteredPaintings.length !== 1 ? 's' : ''}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
          )}
        </div>

        {/* Paintings Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner size="large" />
          </div>
        ) : filteredPaintings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPaintings.map((painting, index) => (
              <div
                key={painting._id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="card-hover"
              >
                <PaintingCard 
                  painting={painting} 
                  onBuyNow={handleBuyNow}
                />
              </div>
            ))}
          </div>
        ) : (
          <div 
            className="text-center py-16"
            data-aos="fade-up"
          >
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No paintings found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any paintings in the "{selectedCategory}" category.
            </p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="btn-primary"
            >
              View All Paintings
            </button>
          </div>
        )}

        {/* Category Descriptions */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {categoriesLoading ? (
            // Loading state for categories
            <div className="col-span-3 text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-kashish-blue rounded-full animate-spin"></div>
              <p className="mt-2 text-gray-600">Loading categories...</p>
            </div>
          ) : (
            // Map over the full category objects from the API
            categoriesData.slice(0, 3).map((category, index) => {
              // Define category-specific properties (icons and colors)
              const categoryConfig = {
                'Landscape': {
                  color: 'bg-kashish-green',
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />,
                },
                'Portrait': {
                  color: 'bg-kashish-red',
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
                },
                'Abstract': {
                  color: 'bg-kashish-blue',
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />,
                },
                // Default for any other category
                'default': {
                  color: 'bg-kashish-blue',
                  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />,
                }
              };
              
              // Get the correct icon/color config or use default
              const config = categoryConfig[category.name] || categoryConfig.default;
              
              return (
                <div 
                  key={category._id}
                  className="bg-white p-6 rounded-xl shadow-sm card-hover"
                  data-aos="fade-up"
                  data-aos-delay={200 + (index * 200)}
                >
                  <div className={`w-12 h-12 ${config.color} rounded-lg flex items-center justify-center mb-4 pulse-glow`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {config.icon}
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{category.name} Paintings</h3>
                  <p className="text-gray-600">
                    {category.description || `Explore our collection of beautiful ${category.name} paintings.`}
                  </p>
                  <button 
                    onClick={() => setSelectedCategory(category.name)}
                    className="mt-4 text-kashish-blue hover:text-kashish-red transition-colors flex items-center gap-1 text-sm font-medium"
                  >
                    View Collection
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              );
            })
          )}

          {/* Show message if no categories are available */}
          {!categoriesLoading && categoriesData.length === 0 && (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-600">No categories available.</p>
            </div>
          )}
        </div>
      </div>

      {/* Buy Modal */}
      <BuyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        painting={selectedPainting}
      />
    </div>
  )
}

export default Products 