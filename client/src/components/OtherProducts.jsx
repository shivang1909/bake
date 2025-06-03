import React from 'react';
import { FaAngleDoubleRight } from 'react-icons/fa';
import { TbShoppingBagPlus } from 'react-icons/tb';

// Sample data
const otherProducts = [
  {
    id: 1,
    name: "Kaju Katli",
    category: "Sweets",
    image: "../../assets/images/Custom/Kajukatri.png",
    rating: 4.5,
    price: 500,
    discountPrice: 420,
    discount: "16% OFF"
  },
  {
    id: 2,
    name: "Masala Banana Chips",
    category: "Namkeen",
    image: "../../assets/images/Custom/KajuRoll.png",
    rating: 4.0,
    price: 150,
    discountPrice: 120,
    discount: "20% OFF"
  },
  {
    id: 3,
    name: "Chocolate Fudge Brownie",
    category: "Bakery",
    image: "../../assets/images/Custom/Kajukatri.png",
    rating: 4.8,
    price: 300,
    discountPrice: 250,
    discount: "17% OFF"
  },
  {
    id: 4,
    name: "Moong Dal Namkeen",
    category: "Namkeen",
    image: "../../assets/images/Custom/MixBites.png",
    rating: 4.2,
    price: 100,
    discountPrice: 85,
    discount: "15% OFF"
  },
  {
    id: 5,
    name: "Dry Fruit Ladoo",
    category: "Sweets",
    image: "../../assets/images/Custom/MixBites.png",
    rating: 4.7,
    price: 450,
    discountPrice: 390,
    discount: "13% OFF"
  }
];

// Dummy functions
const handleAddToCart = (product) => {
  console.log('Added to cart:', product.name);
};

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={i}>⭐</span>);
  }
  if (halfStar) stars.push(<span key="half">⭐½</span>);

  return stars;
};

const OtherProducts = () => {
  const title = "We Think You'll Like These Too!";

  return (
    <div className="mt-5 ml-5 md:mx-10 lg:mx-20 xl:mx-32 2xl:mx-40 bg-white rounded-l-[20px] lg:rounded-[20px] shadow-sm">
      <div className="flex justify-between items-center pl-5  lg:pl-7 pt-4 mb-2">
        <span className="text-2xl font-semibold">{title}</span>
        <button className="text-xs flex items-center gap-1 bg-orange-400 text-white pl-3 pr-2 py-2 rounded-l-full  font-semibold">
          View All <FaAngleDoubleRight />
        </button>
      </div>
      <div className="flex gap-4 p-3 pb-4 px-4 lg:px-6 overflow-x-auto scrollbar-thumb-gray-300 scrollbar-thin">
        {otherProducts.map((product) => (
          <div
            key={product.id}
            className="min-w-[220px] max-w-[240px] bg-white rounded-[20px] p-4 border hover:shadow-md transition duration-300 flex flex-col justify-between"
          >
            <div className="flex justify-center items-center mb-2 h-[100px] lg:h-[130px]">
              <img
                src={product.image}
                alt={product.name}
                className="h-[130px] lg:h-[150px] object-contain p-1"
              />
            </div>
            <div className="text-left mt-3">
              <div className="text-[16px] font-bold leading-tight tracking-wider mb-1 line-clamp-1">
                {product.name}
              </div>
              <p className="text-[12px] text-gray-600 font-medium mb-1">
                {product.category}
              </p>
            </div>
            <div className="flex gap-1 mt-1">
              {renderStars(product.rating || 0)}
            </div>
            <div className="flex flex-col items-start mt-2">
              {product.discount && (
                <span className="text-green-600 tracking-widest font-semibold text-[9px] md:text-[10px] px-2 py-1 rounded-full bg-green-50">
                  {product.discount}
                </span>
              )}
              <div className="w-full flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <span className="line-through text-[12px] text-gray-400">
                    ₹{product.price}
                  </span>
                  <span className="text-[14px] font-bold text-black">
                    ₹{product.discountPrice}
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
        ))}
      </div>
    </div>
  );
};

export default OtherProducts;
