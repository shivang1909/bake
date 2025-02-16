import React from "react";
const ProductCardSkeleton = () => {
  return (
    <div className="animate-pulse bg-gray-200 rounded-lg p-4">
      <div className="h-40 bg-gray-300 rounded-md"></div>
      <div className="mt-3 space-y-2">
        <div className="h-4 bg-gray-300 rounded"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;