import { createContext, useContext, useState, useCallback } from 'react'
import Toast from './Toast'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback(({ message, type = 'info', duration = 3000, position = 'top-right' }) => {
    const id = Date.now() + Math.random()
    const newToast = { id, message, type, duration, position, isVisible: true }
    
    setToasts(prev => [...prev, newToast])
    
    return id
  }, [])

  const hideToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const success = useCallback((message, options = {}) => {
    return showToast({ message, type: 'success', ...options })
  }, [showToast])

  const error = useCallback((message, options = {}) => {
    return showToast({ message, type: 'error', ...options })
  }, [showToast])

  const warning = useCallback((message, options = {}) => {
    return showToast({ message, type: 'warning', ...options })
  }, [showToast])

  const info = useCallback((message, options = {}) => {
    return showToast({ message, type: 'info', ...options })
  }, [showToast])

  const value = {
    showToast,
    hideToast,
    success,
    error,
    warning,
    info
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Render all toasts */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            position={toast.position}
            isVisible={toast.isVisible}
            onClose={() => hideToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
} 