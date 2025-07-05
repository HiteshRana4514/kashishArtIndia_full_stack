import React from 'react';

const ImageGalleryPopup = ({ images, currentIdx, onClose, setCurrentIdx }) => {
  if (!images || images.length === 0) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-xl shadow-2xl p-8 relative flex flex-col items-center w-[600px] max-w-full min-h-[500px]">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          title="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex items-center gap-6 mb-4 w-full justify-center">
          <button
            onClick={() => setCurrentIdx(i => (i === 0 ? images.length - 1 : i - 1))}
            className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"
            title="Previous"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img
            src={typeof images[currentIdx] === 'string' ? images[currentIdx] : URL.createObjectURL(images[currentIdx])}
            alt={`Gallery ${currentIdx + 1}`}
            className="w-[400px] h-[400px] object-contain rounded-xl shadow-lg border"
            style={{ maxWidth: '80vw', maxHeight: '70vh' }}
          />
          <button
            onClick={() => setCurrentIdx(i => (i === images.length - 1 ? 0 : i + 1))}
            className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"
            title="Next"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        {/* Preview thumbnails below main image */}
        <div className="flex gap-3 mt-2 w-full justify-center">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={typeof img === 'string' ? img : URL.createObjectURL(img)}
              alt={`Preview ${idx + 1}`}
              className={`w-20 h-20 object-cover rounded border cursor-pointer transition-all duration-200 ${idx === currentIdx ? 'ring-4 ring-green-400 scale-105' : 'opacity-60 blur-[2px] hover:opacity-100 hover:blur-0'}`}
              onClick={() => setCurrentIdx(idx)}
              style={{ filter: idx === currentIdx ? 'none' : 'blur(2px)' }}
            />
          ))}
        </div>
        <div className="mt-4 text-center text-gray-600 text-sm">
          Image {currentIdx + 1} of {images.length}
        </div>
      </div>
    </div>
  );
};

export default ImageGalleryPopup;
