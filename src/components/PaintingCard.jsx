import { useState } from 'react'

const PaintingCard = ({ painting, onBuyNow }) => {
  return (
    <div className="card group">
      <div className="relative overflow-hidden">
        <img
          src={painting.image}
          alt={painting.title}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${
            painting.category === 'Landscape' ? 'bg-kashish-green' :
            painting.category === 'Portrait' ? 'bg-kashish-red' :
            painting.category === 'Abstract' ? 'bg-kashish-blue' :
            'bg-gray-600'
          }`}>
            {painting.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-kashish-blue transition-colors">
          {painting.title}
        </h3>
        <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-2">
          <span><strong>Medium:</strong> {painting.medium}</span>
          <span><strong>Size:</strong> {painting.size}</span>
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {painting.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-kashish-blue">
            ₹{painting.price.toLocaleString()}
          </span>
          <button
            onClick={() => onBuyNow(painting)}
            className="btn-primary"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaintingCard 