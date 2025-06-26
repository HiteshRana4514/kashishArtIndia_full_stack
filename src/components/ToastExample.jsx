import { useToast } from './ToastContext'

const ToastExample = () => {
  const { success, error, warning, info } = useToast()

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Toast Examples</h3>
      <div className="space-y-3">
        <button
          onClick={() => success('Operation completed successfully!')}
          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Show Success Toast
        </button>
        
        <button
          onClick={() => error('Something went wrong. Please try again.')}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Show Error Toast
        </button>
        
        <button
          onClick={() => warning('Please check your input before proceeding.')}
          className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Show Warning Toast
        </button>
        
        <button
          onClick={() => info('Here is some helpful information for you.')}
          className="w-full px-4 py-2 bg-kashish-blue text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Show Info Toast
        </button>
      </div>
    </div>
  )
}

export default ToastExample 