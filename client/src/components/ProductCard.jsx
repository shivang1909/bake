import React, { useEffect, useRef, useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { TbShoppingBagPlus } from "react-icons/tb";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { valideURLConvert } from "../utils/valideURLConvert";
import { Link } from "react-router-dom";
import renderStars from "./RenderStars";
import "react-lazy-load-image-component/src/effects/blur.css";
import { LazyLoadImage } from "react-lazy-load-image-component";

const ProductCard = ({ product, setCartProduct, className = "" , activeIndex = 0 , setActiveVariant = null}) => {
  const [isloaded, setloaded] = useState(true);

  const url = `/product/${valideURLConvert(product.name)}-${product._id}`;

  const handleAddToCart = (product) => {
    setCartProduct(product);
    if (typeof setActiveVariant === 'function' ) 
      setActiveVariant(activeIndex)
  };

  return (
    <>
      <div
       
        className={`bg-white md:rounded-[24px] min-h-full border hover:shadow-md transition duration-300 flex flex-col justify-between ${className}`}
      >
        <div className="image-section overflow-hidden pt-4 md:pt-2 p-2">
          <Link to={url} className="rounded-lg" state={isloaded}>
            <div className="flex justify-center rounded-xl items-center  mb-2 h-[100px] lg:h-[130px]">
              <LazyLoadImage
                alt="Example"
                wrapperClassName="h-[130px] lg:h-[130px] md:rounded-[24px] md:bg-zinc-50 w-full overflow-hidden"
                className=" w-full h-full object-contain overflow-hidden rounded-lg transition-transform duration-500 ease-in-out scale-110 hover:scale-100"
                effect="blur"
                src={product.coverimage}
              />
            </div>
          </Link>
        </div>
        <div className="Detail-section p-4">
          <Link to={url} className="">
            <div className="text-left mt-3">
              <div className="text-[16px] font-bold leading-tight tracking-wider mb-1 line-clamp-1">
                {product.name}
              </div>
              <p className="text-[12px] text-gray-600 font-medium mb-1">
                {product.category.name}
              </p>
            </div>
          </Link>

          <div className="flex flex-row justify-between items-center gap-1 mt-1">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-1">
                {renderStars(product.averageRating)}
              </div>
              <div className="w-fit hidden">
                <span className="flex justify-between items-center gap-1 bg-yellow-50 text-yellow-500 rounded-lg px-3 text-xs"></span>
              </div>
            </div>

            <div>
              {product.weightVariants[activeIndex].discount > 0 && (
                <span className="text-green-600 tracking-widest font-semibold text-[9px] md:text-[10px] px-2 py-1 rounded-full bg-green-50 w-fit">
                  {product.weightVariants[activeIndex].discount + "% Off"}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-start">
            <div className="w-full flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                {product.weightVariants[activeIndex].discount > 0 && (
                  <span className="line-through text-[12px] text-gray-400">
                    ₹{product.weightVariants[activeIndex].price}
                  </span>
                )}
                <span className="text-[14px] font-bold text-black">
                  ₹
                  {pricewithDiscount(
                    product.weightVariants[activeIndex].price,
                    product.weightVariants[activeIndex].discount
                  )}
                </span>
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                className="border shadow-inner hover:bg-white hover:text-[#ff6a00db] bg-white font-semibold text-[10px] lg:text-sm px-2 py-1 rounded-full text-[#ff6a00db] transition duration-300 active:scale-95 flex items-center"
              >
                <TbShoppingBagPlus className="text-[20px] md:text-[24px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
