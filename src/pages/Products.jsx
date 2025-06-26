import { useState } from 'react'
import { paintings, categories } from '../data/paintings'
import PaintingCard from '../components/PaintingCard'
import BuyModal from '../components/BuyModal'

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPainting, setSelectedPainting] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filteredPaintings = selectedCategory === 'All' 
    ? paintings 
    : paintings.filter(painting => painting.category === selectedCategory)

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
          <p className="text-gray-600">
            Showing {filteredPaintings.length} painting{filteredPaintings.length !== 1 ? 's' : ''}
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
          </p>
        </div>

        {/* Paintings Grid */}
        {filteredPaintings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredPaintings.map((painting, index) => (
              <div
                key={painting.id}
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
          <div 
            className="bg-white p-6 rounded-xl shadow-sm card-hover"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="w-12 h-12 bg-kashish-green rounded-lg flex items-center justify-center mb-4 pulse-glow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Landscape Paintings</h3>
            <p className="text-gray-600">
              Capture the beauty of nature and scenic vistas from across India and beyond. From majestic mountains to serene backwaters.
            </p>
          </div>

          <div 
            className="bg-white p-6 rounded-xl shadow-sm card-hover"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <div className="w-12 h-12 bg-kashish-red rounded-lg flex items-center justify-center mb-4 pulse-glow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Portrait Paintings</h3>
            <p className="text-gray-600">
              Expressive portraits that capture the essence and personality of the subject, painted with emotion and skill.
            </p>
          </div>

          <div 
            className="bg-white p-6 rounded-xl shadow-sm card-hover"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div className="w-12 h-12 bg-kashish-blue rounded-lg flex items-center justify-center mb-4 pulse-glow">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Abstract Paintings</h3>
            <p className="text-gray-600">
              Thought-provoking abstract compositions that explore color, form, and emotion through non-representational art.
            </p>
          </div>
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