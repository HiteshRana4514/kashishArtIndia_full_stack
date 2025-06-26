import { useState } from 'react'
import { blogPosts } from '../data/blogPosts'
import BlogModal from '../components/BlogModal'

const Blog = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleReadMore = (post) => {
    setSelectedPost(post)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedPost(null)
  }

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          className="text-center mb-16"
          data-aos="fade-up"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Art Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover painting techniques, art stories, and insights into the creative process behind our beautiful artworks.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <article 
              key={post.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 card-hover"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="relative">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-kashish-blue text-white text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <span>{formatDate(post.date)}</span>
                </div>
                
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-4">
                  {post.excerpt}
                </p>
                
                <button 
                  className="text-kashish-blue font-medium hover:text-blue-700 transition-colors btn-animate"
                  onClick={() => handleReadMore(post)}
                >
                  Read More →
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div 
          className="mt-16 bg-kashish-blue rounded-2xl p-8 text-center text-white"
          data-aos="zoom-in"
        >
          <h2 
            className="text-3xl font-bold mb-4"
            data-aos="fade-up"
          >
            Stay Updated
          </h2>
          <p 
            className="text-xl mb-6 max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Subscribe to our newsletter for the latest art tips, techniques, and stories delivered to your inbox.
          </p>
          <div 
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
            />
            <button className="bg-white text-kashish-blue font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300 btn-animate">
              Subscribe
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="mt-16">
          <h2 
            className="text-2xl font-bold text-gray-800 mb-8 text-center"
            data-aos="fade-up"
          >
            Explore by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Techniques', 'Landscape', 'Portrait', 'Abstract', 'Stories', 'Culture'].map((category, index) => (
              <button
                key={category}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-center card-hover"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="text-lg font-semibold text-gray-800 mb-2">{category}</div>
                <div className="text-sm text-gray-500">
                  {blogPosts.filter(post => post.category === category).length} posts
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <div 
          className="mt-16 bg-white rounded-2xl shadow-lg overflow-hidden card-hover"
          data-aos="fade-up"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop"
                alt="Featured post"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-kashish-red text-white text-sm font-medium rounded-full">
                  Featured
                </span>
              </div>
            </div>
            <div className="p-8 flex flex-col justify-center">
              <div 
                className="flex items-center text-sm text-gray-500 mb-4"
                data-aos="fade-up"
                data-aos-delay="200"
              >
                <span>Kashish Artist</span>
                <span className="mx-2">•</span>
                <span>{formatDate('2024-01-20')}</span>
              </div>
              <h2 
                className="text-2xl font-bold text-gray-800 mb-4"
                data-aos="fade-up"
                data-aos-delay="300"
              >
                The Complete Guide to Oil Painting for Beginners
              </h2>
              <p 
                className="text-gray-600 mb-6"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                Master the fundamentals of oil painting with this comprehensive guide. Learn about materials, techniques, and step-by-step processes to create your first masterpiece.
              </p>
              <button 
                className="btn-primary self-start btn-animate"
                data-aos="zoom-in"
                data-aos-delay="500"
                onClick={() => handleReadMore({
                  title: 'The Complete Guide to Oil Painting for Beginners',
                  author: 'Kashish Artist',
                  date: '2024-01-20',
                  image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&h=400&fit=crop',
                  category: 'Techniques',
                  content: 'Master the fundamentals of oil painting with this comprehensive guide. Learn about materials, techniques, and step-by-step processes to create your first masterpiece.'
                })}
              >
                Read Full Article
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Blog Modal */}
      <BlogModal isOpen={modalOpen} onClose={handleCloseModal} post={selectedPost} />
    </div>
  )
}

export default Blog 