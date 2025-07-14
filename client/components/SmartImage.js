import React, { useState, useEffect } from 'react';
import { getImageUrlWithFallback } from '../utils/firebaseStorage';

const SmartImage = ({ codigo, alt, className, onError, ...props }) => {
  const [currentSrc, setCurrentSrc] = useState('');
  const [urlIndex, setUrlIndex] = useState(0);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (codigo) {
      const urls = getImageUrlWithFallback(codigo);
      setCurrentSrc(urls[0]);
      setUrlIndex(0);
      setIsError(false);
    }
  }, [codigo]);

  const handleImageError = (e) => {
    const urls = getImageUrlWithFallback(codigo);
    
    if (urlIndex + 1 < urls.length) {
      // Try the next URL strategy
      const nextIndex = urlIndex + 1;
      setUrlIndex(nextIndex);
      setCurrentSrc(urls[nextIndex]);
    } else {
      // All strategies failed, show fallback
      setIsError(true);
      e.target.onerror = null;
      e.target.src = '';
      e.target.style.background = 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)';
      e.target.style.display = 'flex';
      e.target.style.alignItems = 'center';
      e.target.style.justifyContent = 'center';
      e.target.innerHTML = '<span style="color: #64748b; font-size: 14px;">No Image</span>';
      
      if (onError) {
        onError(e);
      }
    }
  };

  if (isError) {
    return (
      <div 
        className={`bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center ${className}`}
        {...props}
      >
        <span className="text-gray-500 text-sm">No Image</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt || codigo}
      className={className}
      onError={handleImageError}
      {...props}
    />
  );
};

export default SmartImage;