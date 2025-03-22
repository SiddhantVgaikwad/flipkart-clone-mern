import React from 'react';

const SkeletonLoader = ({ type }) => {
  // Skeleton for Product Slider
  if (type === 'productSlider') {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-48 bg-gray-300 rounded"></div> {/* Title */}
        <div className="h-4 w-64 bg-gray-300 rounded"></div> {/* Tagline */}
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-48 h-64 bg-gray-300 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  // Skeleton for Deal Slider
  if (type === 'dealSlider') {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-48 bg-gray-300 rounded"></div> {/* Title */}
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex-shrink-0 w-48 h-48 bg-gray-300 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  // Default Skeleton (e.g., for banners or other components)
  return (
    <div className="animate-pulse">
      <div className="h-64 bg-gray-300 rounded-lg"></div>
    </div>
  );
};

export default SkeletonLoader;