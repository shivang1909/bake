import React, { useEffect, useRef, useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { TbShoppingBagPlus } from "react-icons/tb";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import renderStars from "./RenderStars";
import { valideURLConvert } from "../utils/valideURLConvert";
import { Link } from "react-router-dom";

const ListProductCard = ({ product, setCartProduct , activeIndex = 0, setActiveVariant = null}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isloaded, setloaded] = useState(true);

  const url = `/product/${valideURLConvert(product.name)}-${product._id}`;

  const handleAddToCart = (product) => {
    setCartProduct(product);
    if (typeof setActiveVariant === 'function' ) 
      setActiveVariant(activeIndex)
  };

  return (
    <>
      {/* {console.log("List Product is here")} */}
      {/* {console.log(product)} */}
      <div
        key={product._id}
        className="bg-white border shadow-sm rounded-2xl mb-3 m-0 md:m-4  md:min-h-[200px] relative  duration-200 transition-all flex"
      >
        {/* Product Image */}
        <Link to={url}
        className="justify-center w-2/5 items-center flex bg-gray-50 rounded-l-2xl"
state={isloaded}>
        <div className="">
         <div className="h-32 w-32">
            <img
              src={product.coverimage}
              alt={product.name}
              className="h-full w-full object-cover rounded-md"
            />
          
          
         </div>
        </div>
        </Link>

        {/* Product Details */}
        <div className="flex flex-col py-3 px-3 justify-between w-3/5 space-y-4 ">
          <div
            className="cursor-pointer active:scale-95 space-y-2"
            onClick={() => onView(product)}
          >
            <Link to={url}
state={isloaded}>
            <div className="text-left">
              <div
                className="relative inline-block"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <div
                  className={`absolute hidden lg:flex left-0 bottom-full  w-max max-w-xs border border-dashed border-orange-200 bg-white text-orange-500 font-normal text-xs rounded-lg px-3 py-1 shadow-sm z-50 transition-all duration-300 transform
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
                  <span className="text-[16px] font-bold text-left leading-tight tracking-wider  line-clamp-1 mb-1">
                    {product.name}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden">
                <span className="block md:hidden text-[16px] font-bold text-left leading-tight tracking-wider mb-1">
                  {product.name}
                </span>
              </div>

              <p className="text-[12px] text-gray-600 font-medium mb-1">
                {product.category.name}
              </p>
              {/* <p className="text-[12px] text-zinc-700 font-semibold italic mb-2">{product.weight}</p> */}
            </div>
            </Link>

            {/* Star Rating */}
            <div className="flex gap-1 mt-1">
              {renderStars(product.averageRating || 4.5)}
            </div>

            {/* Price Section */}
            <div className="flex items-center gap-2 mt-2">
              {product.weightVariants[activeIndex].discount > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{product.weightVariants[activeIndex].price}
                </span>
              )}
              <span className="text-base font-bold text-gray-900">
                ₹
                {pricewithDiscount(
                  product.weightVariants[activeIndex].price,
                  product.weightVariants[activeIndex].discount
                )}
              </span>
              {/* {product.discount && (
                    <span className="text-xs text-green-600 font-normal">
                      ({product.discount})
                    </span>
                  )} */}
            </div>

            {product.weightVariants[activeIndex].discount > 0 && (
              <span className="text-xs text-green-600 font-normal">
                {product.weightVariants[activeIndex].discount + "% Off"}
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
  );
};

export default ListProductCard;
