import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { apiRequest } from '../utils/api'
import { formatDate, truncateText } from '../utils/formatters'
import LoadingSpinner from '../components/LoadingSpinner'

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTag, setActiveTag] = useState(searchParams.get('tag') || '');
  const [tags, setTags] = useState([]);
  const [featuredBlog, setFeaturedBlog] = useState(null);
  
  // Fetch blogs from the backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        // Try direct fetch first to debug
        console.log('Fetching blogs directly...');
        try {
          const response = await fetch('http://localhost:5000/api/blogs');
          const data = await response.json();
          console.log('Direct API fetch response:', data);
          
          if (data && data.data && Array.isArray(data.data)) {
            // Find a featured blog (newest blog with cover image)
            const sortedBlogs = data.data.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            
            console.log('Sorted blogs:', sortedBlogs);
            
            const withImages = sortedBlogs.filter(blog => blog.coverImage);
            
            if (withImages.length > 0) {
              setFeaturedBlog(withImages[0]);
              // Remove the featured blog from the regular list
              setBlogs(sortedBlogs.filter(blog => blog._id !== withImages[0]._id));
            } else if (sortedBlogs.length > 0) {
              // If no blog has image, still set the first one as featured
              setFeaturedBlog(sortedBlogs[0]);
              setBlogs(sortedBlogs.slice(1)); // Rest of the blogs
            } else {
              setBlogs([]);
            }
            
            setLoading(false);
            return; // Exit early if direct fetch worked
          }
        } catch (directErr) {
          console.error('Direct API fetch error:', directErr);
        }
        
        // Fall back to apiRequest
        const response = await apiRequest('/blogs', 'GET');
        console.log('Blog API response from utility:', response);
        
        if (response.success && response.data) {
          // Find a featured blog (newest blog with cover image)
          const sortedBlogs = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          
          const withImages = sortedBlogs.filter(blog => blog.coverImage);
          
          if (withImages.length > 0) {
            setFeaturedBlog(withImages[0]);
            // Remove the featured blog from the regular list
            setBlogs(sortedBlogs.filter(blog => blog._id !== withImages[0]._id));
          } else if (sortedBlogs.length > 0) {
            // If no blog has image, still set the first one as featured
            setFeaturedBlog(sortedBlogs[0]);
            setBlogs(sortedBlogs.slice(1)); // Rest of the blogs
          } else {
            setBlogs([]);
          }
        } else {
          setError('Failed to load blogs');
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };
    
    const fetchTags = async () => {
      try {
        const response = await apiRequest('/blogs/tags', 'GET');
        // If that fails, try with the full path
        if (!response.success) {
          console.log('Trying alternative tags API path...');
          try {
            const altResponse = await fetch('http://localhost:5000/api/blogs/tags');
            const data = await altResponse.json();
            console.log('Direct tags API fetch response:', data);
            
            if (data && data.success && Array.isArray(data.data)) {
              setTags(data.data);
              return;
            }
          } catch (directErr) {
            console.error('Direct tags API fetch error:', directErr);
          }
        } else if (response.success && Array.isArray(response.data)) {
          setTags(response.data);
        } else {
          console.log('Failed to fetch tags');
        }
      } catch (err) {
        console.error('Error fetching tags:', err);
      }
    };
    
    fetchBlogs();
    fetchTags();
  }, []);
  
  // Handle tag filtering
  useEffect(() => {
    if (activeTag) {
      setSearchParams({ tag: activeTag });
    } else {
      setSearchParams({});
    }
  }, [activeTag, setSearchParams]);
  
  // Ensure blogs array is correctly structured
  const normalizedBlogs = Array.isArray(blogs) ? blogs : (blogs?.data || []);
  
  // Filter blogs by tag if activeTag is set
  const filteredBlogs = activeTag
    ? normalizedBlogs.filter(blog => blog.tags && blog.tags.includes(activeTag))
    : normalizedBlogs;

  // Clear active tag filter
  const clearTagFilter = () => {
    setActiveTag('');
  };
  
  // Set active tag filter
  const handleTagClick = (tag) => {
    setActiveTag(tag);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">
            Kashish Art Blog
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover painting techniques, art stories, and insights into the creative
            process behind our beautiful artworks.
          </p>
        </div>
        
        {/* Tags Filter Bar */}
        {tags && Array.isArray(tags) && tags.length > 0 && (
          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {tags.map((tag, index) => {
              // Check if tag is a string or an object
              const tagName = typeof tag === 'string' ? tag : tag.name;
              const tagCount = typeof tag === 'object' && tag.count ? tag.count : blogs.filter(blog => 
                blog.tags && Array.isArray(blog.tags) && blog.tags.includes(tagName)
              ).length;
              
              return (
                <button
                  key={tagName || `tag-${index}`}
                  onClick={() => handleTagClick(tagName)}
                  className={`px-4 py-2 rounded-full text-center transition-all duration-300 ${activeTag === tagName ? 'bg-kashish-blue text-white shadow-md' : 'bg-white text-gray-800 hover:bg-gray-100 border border-gray-200'}`}
                >
                  <span className="font-medium">{tagName}</span>
                  <span className={`ml-2 text-xs px-2 py-1 rounded-full inline-flex items-center justify-center ${activeTag === tagName ? 'bg-white text-kashish-blue' : 'bg-kashish-blue text-white'}`}>
                    {tagCount}
                  </span>
                </button>
              );
            })}
            
            {activeTag && (
              <button 
                onClick={clearTagFilter}
                className="px-4 py-2 rounded-full text-center transition-all duration-300 bg-white text-kashish-blue border border-kashish-blue hover:bg-kashish-blue hover:text-white"
              >
                Clear Filter
              </button>
            )}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-xl">
            <h3 className="text-xl font-medium mb-2 text-red-600">
              {error}
            </h3>
            <p className="text-gray-600 mb-4">
              Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-kashish-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>
        ) : (
          <>
            {/* Featured Blog (Latest Blog Post) */}
            {featuredBlog && (
              <div className="mb-16">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl flex flex-col md:flex-row max-w-6xl mx-auto">
                  {featuredBlog.coverImage ? (
                    <div className="md:w-1/2 relative">
                      <div className="relative aspect-[4/3] w-full h-full">
                        <img 
                          src={`http://localhost:5000/uploads/blogs/${featuredBlog.coverImage}`} 
                          alt={featuredBlog.title || 'Latest blog post'} 
                          className="w-full h-full object-cover object-center absolute inset-0"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/600x400?text=Kashish+Art+India';
                          }}
                        />
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-kashish-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Latest Post</span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
                      </div>
                    </div>
                  ) : (
                    <div className="md:w-1/2 bg-gradient-to-r from-kashish-blue to-blue-600 h-64 md:h-auto relative">
                      <div className="absolute top-4 left-4">
                        <span className="bg-white text-kashish-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Latest Post</span>
                      </div>
                      <div className="flex items-center justify-center h-full">
                        <span className="text-white text-2xl font-bold px-6 text-center">Kashish Art India</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="p-8 flex flex-col justify-between md:w-1/2">
                    <div>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <span className="mr-2">Published</span>
                        <span className="mr-2">•</span>
                        <span>{formatDate(featuredBlog.createdAt)}</span>
                      </div>
                      
                      <Link to={`/blog/${featuredBlog.slug}`}>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 hover:text-kashish-blue transition-colors">
                          {featuredBlog.title || 'Untitled Blog Post'}
                        </h2>
                      </Link>
                      
                      <p className="text-gray-600 mb-6 text-lg">
                        {featuredBlog.summary || truncateText(featuredBlog.content?.replace(/<[^>]*>/g, '') || 'No content available', 150)}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {featuredBlog.tags && Array.isArray(featuredBlog.tags) && featuredBlog.tags.length > 0 ? featuredBlog.tags.map(tag => (
                          <button 
                            key={tag}
                            onClick={() => handleTagClick(tag)} 
                            className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm hover:bg-kashish-blue hover:text-white transition-colors"
                          >
                            {tag}
                          </button>
                        )) : (
                          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">art</span>
                        )}
                      </div>
                    </div>
                    
                    <Link 
                      to={`/blog/${featuredBlog.slug}`}
                      className="inline-flex items-center justify-center px-6 py-3 bg-kashish-blue text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
                    >
                      Read Full Article
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Blog Posts Grid */}
            {filteredBlogs.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold text-gray-800 mb-8">
                  {activeTag ? `Posts tagged: ${activeTag}` : 'Latest Articles'}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                  {filteredBlogs.map((blog, index) => (
                    <article 
                      key={blog._id} 
                      className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col"
                    >
                      <Link to={`/blog/${blog.slug}`} className="block relative overflow-hidden rounded-t-lg">
                        {blog.coverImage ? (
                          <div className="relative w-full aspect-video overflow-hidden">
                            <img
                              src={`http://localhost:5000/uploads/blogs/${blog.coverImage}`}
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
                        
                        {blog.tags && Array.isArray(blog.tags) && blog.tags.length > 0 && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-kashish-blue text-white text-xs font-medium rounded-full">
                              {blog.tags[0]}
                            </span>
                          </div>
                        )}
                      </Link>
                      
                      <div className="p-6 flex-grow flex flex-col">
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <span className="mr-2">Published</span>
                          <span className="mr-2">•</span>
                          <span>{formatDate(blog.createdAt)}</span>
                        </div>
                        
                        <Link to={`/blog/${blog.slug}`} className="group">
                          <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-kashish-blue transition-colors">
                            {blog.title || 'Untitled Blog Post'}
                          </h3>
                        </Link>
                        
                        <p className="text-gray-600 mb-4 flex-grow">
                          {blog.summary || truncateText(blog.content?.replace(/<[^>]*>/g, '') || 'No content available', 120)}
                        </p>
                        
                        <Link 
                          to={`/blog/${blog.slug}`}
                          className="text-kashish-blue font-medium hover:text-blue-700 transition-colors flex items-center mt-2"
                        >
                          Read More
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </>
            ) : (
              activeTag ? (
                <div className="text-center py-16 mb-8 bg-white rounded-xl shadow">
                  <h3 className="text-xl font-medium mb-3">No blog posts found with tag: <span className="text-kashish-blue">{activeTag}</span></h3>
                  <button 
                    onClick={clearTagFilter}
                    className="mt-4 inline-flex items-center px-6 py-3 bg-kashish-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Show All Posts
                  </button>
                </div>
              ) : (
                <div className="text-center py-16 mb-8 bg-white rounded-xl shadow">
                  <h3 className="text-xl font-medium mb-3">No blog posts available</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    We're working on creating amazing content for you. Check back soon for new art blogs and updates!
                  </p>
                </div>
              )
            )}

            {/* Newsletter Signup */}
            <div className="mt-20 bg-kashish-blue rounded-2xl p-10 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">
                Stay Updated
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Subscribe to our newsletter for the latest art tips, techniques, and stories delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
                />
                <button className="bg-white text-kashish-blue font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-all duration-300">
                  Subscribe
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Blog
