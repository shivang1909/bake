import React, { useEffect, useRef, useState } from "react";
import { FaShippingFast, FaGlobe, FaLeaf } from "react-icons/fa";
import { BiTimeFive } from "react-icons/bi";
import { useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import ProductCard from "../components/ProductCard"
import ProductLoader from "../components/ProductLoader";
import AddToCartBottomBar from "../components/AddToCartBottomBar";

const features = [
  {
    icon: <FaShippingFast size={28} />,
    text: "National Shipping in 5–7 days",
  },
  {
    icon: <BiTimeFive size={28} />,
    text: "15 Days Shelf Life",
  },
  {
    icon: <FaGlobe size={28} />,
    text: "International Shipping in 5–7 Days",
  },
  {
    icon: <FaLeaf size={28} />,
    text: "No Preservatives",
  },
];

const Category = () => {

  const [catproducts, setcatproducts] = useState([])
  const [cartProduct, setCartProduct] = useState(null);
  const handleCloseBottomBar = () => {
      setCartProduct(null);
    };
      const ref = useRef(null);

  const params = useParams();
  const fullCategoryParam = params?.Category || "";
  const categoryId = fullCategoryParam.split("-").slice(-1)[0];
  const categoryNameSlug = fullCategoryParam.split("-").slice(0, -1).join("-");
  

  const fetchproductbycategory = async (categoryId) => {
    const response = await Axios({
      ...SummaryApi.getProductByCategory,
      data: { id: categoryId },
    });
    const { data: responseData } = response;
    if (responseData.success) {
      console.log(responseData);
      setcatproducts(responseData.data)
    } else {
      console.error(
        "Failed to fetch products by category:",
        responseData.message
      );
    }
  };
  useEffect(() => {
    fetchproductbycategory(categoryId)
  }, [fullCategoryParam]);

  return (
    <>
    <div className="bg-gray-50 min-h-screen py-8 lg:mt-20">
      <style>
        {`
          @font-face {
            font-family: 'Bartex';
            src: url('/Fonts/Bartex-Regular.ttf') format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>
      <div className=" flex flex-col items-center text-center space-y-2">
        <h1
          className="text-5xl md:text-7xl font-thin text-[#1e293b] flex justify-center items-center gap-2"
          style={{ fontFamily: "Bartex, sans-serif" }}
        >
          {/* <span className="text-yellow-600 text-3xl">💮</span> */}
          {categoryNameSlug}
          {/* <span className="text-yellow-600 text-3xl">💮</span> */}
        </h1>
        <p className="flex gap-2 items-center text-gray-700">
          <span className="text-sm text-gray-500">Home &gt; </span>
          <span className="text-sm text-gray-800 font-medium">Sweets</span>
        </p>
        <p className="font-semibold text-lg">30 Products</p>
      </div>

      {/* <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-6 md:px-20">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center space-y-3 text-center"
          >
            <div className="bg-orange-400 text-white rounded-full p-4">
              {feature.icon}
            </div>
            <p className="text-gray-800 font-medium">{feature.text}</p>
          </div>
        ))}
      </div> */}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-5 justify-center items-center px-5 lg:px-32  lg:gap-10">
          {
            catproducts.map((product,index)=>(
              <ProductCard product={product} setCartProduct={setCartProduct}/>
            )
          )
          }
      </div>
    </div>
    {cartProduct && (
        <AddToCartBottomBar
          reference={ref}
          product={cartProduct}
          onClose={handleCloseBottomBar}
        />
      )}
    </>
    
  );
};

export default Category;
