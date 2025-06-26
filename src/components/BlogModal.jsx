import { useState, useEffect } from 'react'

const reactionsList = [
  { label: 'Like', emoji: '👍' },
  { label: 'Love', emoji: '❤️' },
  { label: 'Wow', emoji: '😮' },
  { label: 'Inspiring', emoji: '✨' },
]

const BlogModal = ({ isOpen, onClose, post }) => {
  const [selectedReaction, setSelectedReaction] = useState(null)
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !post) return null

  const handleReaction = (reaction) => {
    setSelectedReaction(selectedReaction === reaction ? null : reaction)
  }

  const handleFeedbackChange = (e) => {
    setFeedback({ ...feedback, [e.target.name]: e.target.value })
  }

  const handleFeedbackSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFeedback({ name: '', email: '', message: '' })
      setSubmitted(false)
      onClose()
      alert('Thank you for your feedback!')
    }, 1000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Blog Content */}
        <div className="p-8 pt-6">
          <div className="mb-4 flex items-center gap-3">
            <img src={post.image} alt={post.title} className="w-20 h-20 object-cover rounded-lg" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{post.title}</h2>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span>{post.author}</span>
                <span>•</span>
                <span>{new Date(post.date).toLocaleDateString()}</span>
                <span className="ml-2 px-2 py-1 bg-kashish-blue text-white text-xs rounded-full">{post.category}</span>
              </div>
            </div>
          </div>
          <div className="prose max-w-none text-gray-700 mb-8" style={{ whiteSpace: 'pre-line' }}>
            {post.content}
          </div>

          {/* Reactions */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Reaction</h3>
            <div className="flex gap-4">
              {reactionsList.map((r) => (
                <button
                  key={r.label}
                  onClick={() => handleReaction(r.label)}
                  title={`${r.label} this post`}
                  className={`text-2xl px-4 py-2 rounded-lg border transition-all duration-200 focus:outline-none relative group ${
                    selectedReaction === r.label
                      ? 'bg-kashish-blue text-white border-kashish-blue scale-110 shadow-lg'
                      : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-kashish-blue hover:text-white hover:border-kashish-blue'
                  }`}
                  aria-label={r.label}
                >
                  {r.emoji}
                  {/* Custom Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                    {r.label} this post
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800"></div>
                  </div>
                </button>
              ))}
            </div>
            {selectedReaction && (
              <div className="mt-2 text-sm text-kashish-blue font-medium">You reacted: {selectedReaction}</div>
            )}
          </div>

          {/* Feedback Form */}
          <div className="mb-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Leave Feedback</h3>
            <form onSubmit={handleFeedbackSubmit} className="space-y-3">
              <div className="flex gap-3">
                <input
                  type="text"
                  name="name"
                  value={feedback.name}
                  onChange={handleFeedbackChange}
                  required
                  placeholder="Your Name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kashish-blue focus:border-transparent"
                />
                <input
                  type="email"
                  name="email"
                  value={feedback.email}
                  onChange={handleFeedbackChange}
                  required
                  placeholder="Your Email"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kashish-blue focus:border-transparent"
                />
              </div>
              <textarea
                name="message"
                value={feedback.message}
                onChange={handleFeedbackChange}
                required
                rows="3"
                placeholder="Your feedback..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kashish-blue focus:border-transparent"
              />
              <button
                type="submit"
                disabled={submitted}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitted ? 'Submitting...' : 'Submit Feedback'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogModal 