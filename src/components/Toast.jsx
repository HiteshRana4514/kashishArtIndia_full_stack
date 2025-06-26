import { useState, useEffect } from 'react'

const Toast = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  isVisible, 
  onClose,
  position = 'top-right' 
}) => {
  const [isShowing, setIsShowing] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsShowing(true)
      
      // Auto hide after duration
      const timer = setTimeout(() => {
        setIsShowing(false)
        setTimeout(() => {
          onClose()
        }, 300) // Wait for fade out animation
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const getToastStyles = () => {
    const baseStyles = "fixed z-50 max-w-sm w-full p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out"
    
    const typeStyles = {
      success: "bg-green-500 text-white border-l-4 border-green-600",
      error: "bg-red-500 text-white border-l-4 border-red-600", 
      warning: "bg-yellow-500 text-white border-l-4 border-yellow-600",
      info: "bg-kashish-blue text-white border-l-4 border-blue-600"
    }

    const positionStyles = {
      'top-right': 'top-4 right-4',
      'top-left': 'top-4 left-4', 
      'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
      'bottom-right': 'bottom-4 right-4',
      'bottom-left': 'bottom-4 left-4',
      'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2'
    }

    const animationStyles = isShowing 
      ? 'translate-y-0 opacity-100 scale-100' 
      : 'translate-y-2 opacity-0 scale-95'

    return `${baseStyles} ${typeStyles[type]} ${positionStyles[position]} ${animationStyles}`
  }

  const getIcon = () => {
    const icons = {
      success: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      error: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      warning: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      info: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
    return icons[type]
  }

  if (!isVisible) return null

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <div className="flex-shrink-0 ml-3">
          <button
            onClick={() => {
              setIsShowing(false)
              setTimeout(() => {
                onClose()
              }, 300)
            }}
            className="text-white hover:text-gray-200 focus:outline-none focus:text-gray-200 transition-colors duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Toast 