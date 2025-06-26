import { Link } from 'react-router-dom'
import { useState } from 'react'
import { paintings } from '../data/paintings'
import { blogPosts } from '../data/blogPosts'
import PaintingCard from '../components/PaintingCard'
import BuyModal from '../components/BuyModal'

const Home = () => {
  const featuredPaintings = paintings.slice(0, 6)
  const recentBlogPosts = blogPosts.slice(0, 3)
  const [selectedPainting, setSelectedPainting] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleBuyNow = (painting) => {
    setSelectedPainting(painting)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPainting(null)
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden hero-bg">
        {/* Floating Elements */}
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-gradient"
            data-aos="fade-down"
            data-aos-delay="200"
          >
            Kashish Art India
          </h1>
          <p 
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            Discover the beauty of Indian art through our unique collection of paintings that tell stories and capture emotions.
          </p>
          <div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            data-aos="zoom-in"
            data-aos-delay="600"
          >
            <Link to="/products" className="btn-primary text-lg px-8 py-3 btn-animate">
              Explore Paintings
            </Link>
            <Link to="/about" className="bg-white text-kashish-blue hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg btn-animate">
              Learn About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="text-center mb-12"
            data-aos="fade-up"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Welcome to Kashish Art India
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are passionate about bringing the rich cultural heritage and artistic traditions of India to art lovers worldwide. 
              Each painting is carefully crafted to capture the essence of our beautiful country and its diverse landscapes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="w-16 h-16 bg-kashish-blue rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Handcrafted with Love</h3>
              <p className="text-gray-600">Every painting is created with passion and attention to detail, ensuring the highest quality artwork.</p>
            </div>
            
            <div 
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div className="w-16 h-16 bg-kashish-red rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Timeless Beauty</h3>
              <p className="text-gray-600">Our paintings are designed to bring lasting beauty and joy to your home for generations to come.</p>
            </div>
            
            <div 
              className="text-center"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <div className="w-16 h-16 bg-kashish-green rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Indian Heritage</h3>
              <p className="text-gray-600">Celebrating the rich cultural heritage and artistic traditions of India through contemporary expression.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="text-center mb-12"
            data-aos="fade-up"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Explore by Category
            </h2>
            <p className="text-xl text-gray-600">
              Discover our diverse collection of artistic styles and themes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Landscape Category */}
            <div 
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <img 
                src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=400&fit=crop" 
                alt="Landscape Paintings" 
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Landscape</h3>
                <p className="text-gray-200 mb-4">Breathtaking views of nature's beauty</p>
                <Link 
                  to="/products?category=Landscape" 
                  className="inline-flex items-center text-white hover:text-kashish-blue transition-colors duration-200"
                >
                  Explore Collection
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Portrait Category */}
            <div 
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop" 
                alt="Portrait Paintings" 
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Portrait</h3>
                <p className="text-gray-200 mb-4">Capturing the essence of human emotion</p>
                <Link 
                  to="/products?category=Portrait" 
                  className="inline-flex items-center text-white hover:text-kashish-red transition-colors duration-200"
                >
                  Explore Collection
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Abstract Category */}
            <div 
              className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <img 
                src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=400&fit=crop" 
                alt="Abstract Paintings" 
                className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Abstract</h3>
                <p className="text-gray-200 mb-4">Expressive forms and vibrant colors</p>
                <Link 
                  to="/products?category=Abstract" 
                  className="inline-flex items-center text-white hover:text-kashish-green transition-colors duration-200"
                >
                  Explore Collection
                  <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Paintings */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="text-center mb-12"
            data-aos="fade-up"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Featured Paintings
            </h2>
            <p className="text-xl text-gray-600">
              Explore our handpicked collection of beautiful artworks
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPaintings.map((painting, index) => (
              <div
                key={painting.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <PaintingCard 
                  painting={painting} 
                  onBuyNow={handleBuyNow}
                />
              </div>
            ))}
          </div>
          
          <div 
            className="text-center mt-12"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            <Link to="/products" className="btn-primary text-lg px-8 py-3 btn-animate">
              View All Paintings
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Blog Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="text-center mb-12"
            data-aos="fade-up"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Latest from Our Blog
            </h2>
            <p className="text-xl text-gray-600">
              Discover art tips, techniques, and stories from our artists
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentBlogPosts.map((post, index) => (
              <div
                key={post.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-kashish-blue text-white text-xs rounded-full">
                      {post.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link 
                    to="/blog" 
                    className="text-kashish-blue hover:text-kashish-red font-medium transition-colors duration-200"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div 
            className="text-center mt-12"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            <Link to="/blog" className="btn-primary text-lg px-8 py-3 btn-animate">
              See All Posts
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-kashish-blue">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 
            className="text-4xl font-bold text-white mb-4"
            data-aos="fade-up"
          >
            Ready to Find Your Perfect Painting?
          </h2>
          <p 
            className="text-xl text-blue-100 mb-8"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Browse our complete collection and find the artwork that speaks to your soul.
          </p>
          <Link 
            to="/products" 
            className="bg-white text-kashish-blue hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 text-lg btn-animate"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            Start Exploring
          </Link>
        </div>
      </section>

      {/* Buy Modal */}
      <BuyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        painting={selectedPainting}
      />
    </div>
  )
}

export default Home 