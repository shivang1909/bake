import React from "react";
import { FaStar, FaLeaf, FaShoppingCart } from "react-icons/fa";
import { GiDuration, GiIndiaGate } from "react-icons/gi";
import { FaTruckFast } from "react-icons/fa6";


const ProductDisplaySkeleton = () => {
  return (
    <div className="mt-10 max-w-7xl mx-auto px-4 py-10 bg-white lg:mt-20 animate-pulse">
      {/* Breadcrumb Skeleton */}
     <div className="lg:flex space-y-2 mb-5 w-1/2">
  <div className="h-[20px] w-full  bg-gray-200 rounded"></div>
</div>


      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Images (matches your exact dimensions) */}
        <div className="w-full lg:w-1/2 h-full [@media(min-height:1366px)]:max-h-[25vh] max-h-[75vh] lg:max-h-[60vh]">
          {/* Main Image */}
<div
  className="
    relative w-full min-w-fit
    h-[250px] sm:h-[300px] md:h-[350px] lg:h-[58vh]
    mb-3 bg-gray-200 rounded-2xl overflow-hidden
  "
></div>          
          {/* Thumbnails */}
          <div className="flex space-x-8 overflow-x-auto">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="border rounded-xl p-1 bg-gray-50">
                <div className="w-16 h-16 bg-gray-200 object-contain rounded-md"></div>
              </div>
            ))}
          </div>
        </div>


        {/* Right: Product Info (exact replica of your layout) */}
        <div className="w-full lg:w-1/2 px-3 md:px-0">
          {/* Category & Title */}
          <div className="flex justify-between items-start">
            <div>
              <div className="h-6 w-24 bg-orange-500 rounded-md mb-2"></div>
              <div className="h-10 w-3/4 bg-gray-200 rounded"></div>
            </div>
            <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-md">
              <FaStar className="text-gray-300" />
              <div className="h-4 w-4 bg-gray-300 rounded"></div>
            </div>
          </div>


          {/* Description */}
          <div className="mt-4 max-w-md space-y-3">
            <div className="h-4 w-full bg-gray-200 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
            <div className="h-4 w-2/3 bg-gray-200 rounded"></div>
          </div>


          {/* Price and Discount */}
          <div className="flex items-center gap-4 mt-5">
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
            <div className="h-5 w-16 bg-gray-200 rounded"></div>
          </div>


          {/* Variants */}
          <div className="mt-5">
            <div className="h-5 w-40 bg-gray-200 rounded mb-3"></div>
            <div className="flex flex-row overflow-x-auto whitespace-nowrap gap-2">
              <div className="px-4 py-2 bg-gray-200 rounded-[35px] w-24"></div>
              <div className="px-4 py-2 bg-gray-200 rounded-[35px] w-24"></div>
            </div>
          </div>


          {/* Add to Cart Button */}
          <div className="mt-8">
            <div className="h-12 w-full bg-orange-500 rounded-full"></div>
          </div>
        </div>
      </div>


      {/* Divider Image */}
      <div className="h-8 w-full bg-gray-200 lg:mt-28 mt-20 "></div>


      {/* Features Section (exact replica) */}
      <div className="bg-[#FAF7F2] py-10 w-full flex justify-center">
        <div className="grid grid-cols-2 md:flex gap-6 justify-between max-w-4xl w-full px-4">
          {/* Icon 1 */}
          <div className="flex flex-col space-y-2 justify-center items-center whitespace-nowrap">
            <div className="text-6xl bg-white border border-orange-300 border-dotted text-gray-200 px-3 py-3 rounded-full">
              <GiDuration />
            </div>
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>


          {/* Icon 2 */}
          <div className="flex flex-col space-y-2 justify-center items-center whitespace-nowrap">
            <div className="text-6xl bg-white border border-orange-300 border-dotted text-gray-200 px-3 py-3 rounded-full">
              <FaTruckFast />
            </div>
            <div className="h-3 w-20 bg-gray-200 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>


          {/* Icon 3 */}
          <div className="flex flex-col space-y-2 justify-center items-center whitespace-nowrap">
            <div className="text-6xl bg-white border border-orange-300 border-dotted text-gray-200 px-3 py-3 rounded-full">
              <GiIndiaGate />
            </div>
            <div className="h-3 w-12 bg-gray-200 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>


          {/* Icon 4 */}
          <div className="flex flex-col space-y-2 justify-center items-center whitespace-nowrap">
            <div className="text-6xl bg-white border border-orange-300 border-dotted text-gray-200 px-3 py-3 rounded-full">
              <FaLeaf />
            </div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>


      {/* Bottom Divider */}
      <div className="h-8 w-full bg-gray-200 rotate-180"></div>


      {/* Recommended Products Section */}
      <div className="lg:mt-28 mt-8 ml-5 md:mx-10 lg:mx-20 xl:mx-32 2xl:mx-40 bg-gray-50 rounded-l-[20px] lg:rounded-[20px] shadow-sm">
        <div className="h-8 w-64 bg-gray-200 rounded mb-4 ml-5 lg:ml-7 pt-4"></div>
        <div className="flex gap-4 p-3 pb-4 px-4 lg:px-6 overflow-x-auto">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="rounded-[15px] min-w-[200px] max-w-[200px] md:min-w-[220px] h-[300px] bg-gray-200"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default ProductDisplaySkeleton;
