import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import PaintingCard from '../components/PaintingCard'
import BuyModal from '../components/BuyModal'
import LoadingSpinner from '../components/LoadingSpinner'
import { apiRequest } from '../utils/api'

const Home = () => {
  const [selectedPainting, setSelectedPainting] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const [featuredPaintings, setFeaturedPaintings] = useState([])
  const [recentBlogs, setRecentBlogs] = useState([])
  const [paintingsLoading, setPaintingsLoading] = useState(true)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [blogsLoading, setBlogsLoading] = useState(true)
  const [error, setError] = useState(null)

  const handleBuyNow = (painting) => {
    setSelectedPainting(painting)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedPainting(null)
  }

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await apiRequest('/categories', 'GET');
        const categoriesData = Array.isArray(response.categories) ? response.categories : [];
        setCategories(categoriesData.filter(category => category.isActive));
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);
  
  // Fetch featured paintings from API
  useEffect(() => {
    const fetchFeaturedPaintings = async () => {
      try {
        setPaintingsLoading(true);
        const response = await apiRequest('/paintings', 'GET');
        const paintingsData = response.paintings || response;
        console.log('paintingsData', paintingsData);
        
        // Only get paintings that are both available AND featured
        const featuredPaintings = paintingsData.filter(painting => 
          painting.isAvailable && painting.isFeatured
        );
        
        // Limit to 6 featured paintings
        setFeaturedPaintings(featuredPaintings.slice(0, 6));
        
        // If we have no featured paintings, show a message
        if (featuredPaintings.length === 0) {
          console.log('No featured paintings found');
        }
      } catch (error) {
        console.error('Error fetching paintings:', error);
        setError('Failed to load featured paintings');
      } finally {
        setPaintingsLoading(false);
      }
    };
    
    fetchFeaturedPaintings();
  }, []);

  // Fetch recent blog posts
  useEffect(() => {
    const fetchRecentBlogs = async () => {
      try {
        setBlogsLoading(true);
        console.log('Fetching blogs from API...');
        
        // Get all blogs and sort them by date
        const response = await apiRequest('/blogs', 'GET');
        console.log('Blog API response:', response);
        
        // Check response structure and extract blogs
        let blogs = [];
        
        // The blog API returns different structures, handle all possible cases
        if (response && response.data && Array.isArray(response.data)) {
          blogs = response.data; // Standard API response structure
          console.log('Found blogs in response.data');
        } else if (response && response.blogs && Array.isArray(response.blogs)) {
          blogs = response.blogs;
          console.log('Found blogs in response.blogs');
        } else if (Array.isArray(response)) {
          blogs = response;
          console.log('Found blogs in array response');
        }
        
        console.log('Extracted blogs:', blogs);
        
        // Sort by createdAt date (newest first)
        blogs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Get only the 3 most recent blogs
        const recentBlogsData = blogs.slice(0, 3);
        console.log('Recent blogs (3):', recentBlogsData);
        setRecentBlogs(recentBlogsData);
      } catch (error) {
        console.error('Error fetching recent blogs:', error);
      } finally {
        setBlogsLoading(false);
      }
    };
    
    fetchRecentBlogs();
  }, []);

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
            {categoriesLoading ? (
              // Loading placeholders
              [...Array(3)].map((_, index) => (
                <div 
                  key={index}
                  className="bg-gray-200 rounded-xl shadow-lg h-64 animate-pulse"
                  data-aos="fade-up"
                  data-aos-delay={200 + (index * 200)}
                ></div>
              ))
            ) : categories.length === 0 ? (
              // No categories message
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-600 text-lg">No categories found.</p>
              </div>
            ) : (
              // Map through actual categories
              categories.slice(0, 3).map((category, index) => (
                <div 
                  key={category._id}
                  className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={200 + (index * 200)}
                >
                  <img 
                    src={category.image || `https://via.placeholder.com/500x400?text=${category.name}`} 
                    alt={`${category.name} Paintings`} 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-gray-200 mb-4 line-clamp-2">{category.description || `Explore our ${category.name} collection`}</p>
                    <Link 
                      to={`/products?category=${category._id}`} 
                      className="inline-flex items-center text-white hover:text-kashish-blue transition-colors duration-200"
                    >
                      Explore Collection
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))
            )}
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
            {paintingsLoading ? (
              // Loading placeholders
              [...Array(6)].map((_, index) => (
                <div 
                  key={index}
                  className="bg-gray-200 rounded-xl shadow-lg h-96 animate-pulse"
                  data-aos="fade-up"
                  data-aos-delay={100 * index}
                ></div>
              ))
            ) : error ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-red-500 text-lg">{error}</p>
              </div>
            ) : featuredPaintings.length === 0 ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-gray-600 text-lg">No paintings available at the moment.</p>
              </div>
            ) : (
              featuredPaintings.map((painting, index) => (
                <div
                  key={painting._id}
                  className="h-full"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <PaintingCard 
                    painting={painting} 
                    onBuyNow={handleBuyNow}
                  />
                </div>
              ))
            )}
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
          
          {blogsLoading ? (
            <div className="flex justify-center items-center py-20">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentBlogs.length > 0 ? (
                recentBlogs.map((blog, index) => (
                  <div
                    key={blog._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    {blog.coverImage ? (
                      <div className="relative w-full aspect-video overflow-hidden">
                        <img 
                          src={blog.coverImage} 
                          alt={blog.title} 
                          className="w-full h-full object-cover object-center absolute inset-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x250?text=Kashish+Art+India';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-40"></div>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-kashish-blue to-blue-600 aspect-video flex items-center justify-center">
                        <span className="text-white text-xl font-bold px-6 text-center">Kashish Art India</span>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        {blog.tags && blog.tags.length > 0 && (
                          <span className="px-3 py-1 bg-kashish-blue text-white text-xs rounded-full">
                            {blog.tags[0]}
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {blog.summary}
                      </p>
                      <Link 
                        to={`/blog/${blog.slug}`}
                        className="text-kashish-blue hover:text-kashish-red font-medium transition-colors duration-200"
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-lg text-gray-600">No blog posts available yet.</p>
                </div>
              )}
            </div>
          )}
          
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