import React, { useEffect, useRef, useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { TbShoppingBagPlus } from "react-icons/tb";
import { pricewithDiscount } from "../utils/PriceWithDiscount";


const ListProductCard= ({product,setCartProduct})=> {
  const [showTooltip, setShowTooltip] = useState(false);


  const handleAddToCart = (product) => {
          setCartProduct(product);
        };
        
        const renderStars = (rating) => {
          const stars = [];
          for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(rating)) {
              stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
            } else if (i - rating < 1) {
              stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />);
            } else {
              stars.push(<FaRegStar key={i} className="text-yellow-400 text-xs" />);
            }
          }
          return stars;
        };
  return (
    <>
    {/* {console.log("List Product is here")} */}
    {/* {console.log(product)} */}
       <div key={product._id} className="bg-white border shadow-sm rounded-2xl mb-3 m-0 md:m-4  md:min-h-[200px] relative  duration-200 transition-all flex">
            {/* Product Image */}
            <div className="justify-center w-2/5 items-center flex bg-gray-50 rounded-l-2xl">
            <img
            src={product.coverimage}
            alt={product.name}
                className="h-32 w-32 object-cover rounded-md"
              />
            </div>
      
            {/* Product Details */}
            <div className="flex flex-col py-3 px-2 justify-between w-3/5 space-y-4 ">
              <div
                className="cursor-pointer active:scale-95"
                onClick={() => onView(product)}
              >
                <div className="text-left">
                  <div
                    className="relative inline-block"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    <div
                      className={`absolute hidden lg:flex left-0 bottom-full mb-2 w-max max-w-xs border border-dashed border-orange-200 bg-white text-orange-500 font-normal text-xs rounded-lg px-3 py-1 shadow-sm z-50 transition-all duration-300 transform
               ${
                 showTooltip
                   ? "opacity-100 scale-100"
                   : "opacity-0 scale-95 pointer-events-none"
               }
             `}
                    >
                      {product.name}
                    </div>
                    <div className="hidden md:block">
                      <h2 className="text-[16px] font-bold text-left leading-tight tracking-wider mb-1 line-clamp-1">
                        {product.name}
                      </h2>
                    </div>
                  </div>
                  <div className="overflow-hidden">
                    <h2 className="block md:hidden text-[16px] font-bold text-left leading-tight tracking-wider mb-1">
                      {product.name}
                    </h2>
                  </div>
      
                  <p className="text-[12px] text-gray-600 font-medium mb-1">
                    {product.category.name}
                  </p>
                   {/* <p className="text-[12px] text-zinc-700 font-semibold italic mb-2">{product.weight}</p> */}
                </div>
      
                {/* Star Rating */}
                <div className="flex gap-1 mt-1">
                  {renderStars(product.rating || 0)}
                </div>
      
                {/* Price Section */}
                <div className="flex items-center gap-2 mt-2">
                    {product.weightVariants[0].discount > 0 && (
                  <span className="text-sm text-gray-400 line-through">
                     ₹{product.weightVariants[0].price}
                  </span>
                      )}
                  <span className="text-base font-bold text-gray-900">
                   ₹
                                   {pricewithDiscount(
                                     product.weightVariants[0].price,
                                     product.weightVariants[0].discount
                                   )}
                  </span>
                  {/* {product.discount && (
                    <span className="text-xs text-green-600 font-normal">
                      ({product.discount})
                    </span>
                  )} */}
                </div>
      
                 {product.weightVariants[0].discount > 0 && (
                  <span className="text-xs text-green-600 font-normal">
                    {product.weightVariants[0].discount + "% Off"}
                  </span>
                 )}
              </div>
      
              {/* Add to Cart Button */}
              <button
                onClick={() => handleAddToCart(product)}
                className="w-full tracking-widest bg-[#F58220] text-white shadow-inner border-orange-500  px-3.5 md:px-4 py-2 rounded-full text-[12px] font-bold active:bg-orange-400 active:text-white transition flex justify-center items-center gap-1 mt-2 md:mt-0 active:scale-95"
              >
                Add to Cart <TbShoppingBagPlus className="text-[18px]" />
              </button>
            </div>
          </div>
    </>
  )
}

export default ListProductCard