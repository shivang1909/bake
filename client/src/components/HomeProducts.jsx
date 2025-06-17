import React, { useEffect, useRef, useState } from "react";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { TbShoppingBagPlus } from "react-icons/tb";
import AddToCartBottomBar from "./AddToCartBottomBar";
import { FaAngleDoubleRight } from "react-icons/fa";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import throttle from "lodash.throttle";
import ProductCard from "./ProductCard";
import { setAllProduct } from "../store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { setDataLoading } from "../store/loadingSlice";
import { RxCornerTopLeft } from "react-icons/rx";
import { Link } from "react-router-dom";
import { valideURLConvert } from "../utils/valideURLConvert";

const HomeProducts = () => {
  const [cartProduct, setCartProduct] = useState(null);
  const [sections, setsections] = useState([]);
  // const [sections, setSections] = useState([]);
  useEffect(() => {
    console.log("fetch called");
    fetchProducts();
    
  }, []);
  const dispatch = useDispatch();
  const allProduct = useSelector((state) => state.product.Allproduct);
  console.log(allProduct);

  const fetchProducts = async () => {
    const response = await Axios({ ...SummaryApi.getHomepageSections });
    setsections(response.data);
    console.log(response.data);
    // setSections(response.data);
  };



  const handleCloseBottomBar = () => {
    setCartProduct(null);
  };



  const scrollRefs = useRef([]);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e, index) => {
    isDragging.current = true;
    startX.current = e.pageX - scrollRefs.current[index].offsetLeft;
    scrollLeft.current = scrollRefs.current[index].scrollLeft;
  };

  const handleMouseMove = throttle((e, index) => {
    if (!isDragging.current) return;
    const x = e.pageX - scrollRefs.current[index].offsetLeft;
    const walk = x - startX.current;
    scrollRefs.current[index].scrollLeft = scrollLeft.current - walk;
  }, 10);

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    return () => {
      isDragging.current = false; // cleanup on unmount
    };
  }, []);

  return (
    <>
      {
        sections.map((section, index) => (
          <div
            key={index}
            className="mt-5 ml-5 md:mx-10 lg:mx-20 xl:mx-32 2xl:mx-40 bg-gray-50 rounded-l-[20px] lg:rounded-[20px] shadow-sm"
          >
            <div className="flex justify-between items-center pl-5 lg:pl-7 pt-4 mb-2">
              <span className="text-2xl font-semibold">
                {section.sectionName}
              </span>
              <button className="text-xs flex items-center gap-1 bg-orange-400 text-white pl-3 pr-2 py-2 rounded-l-full font-semibold">
               <Link to={`/Featured/${valideURLConvert(section.sectionName)}-${section._id}`}> 
                View All 
                </Link><FaAngleDoubleRight />
              </button>
            </div>

            <div
              ref={(el) => (scrollRefs.current[index] = el)}
              onMouseDown={(e) => handleMouseDown(e, index)}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="flex gap-4 overflow-x-auto px-5 pb-4 cursor-grab active:cursor-grabbing select-none"
            >
             
              {section.productIds.map((product) => (
                <>
                {console.log("Cat is here in Home :)")}
                {console.log(product)}
               
                <ProductCard
                  product={product}
                  setCartProduct={setCartProduct}
                   className="rounded-[15px] min-w-[200px] max-w-[200px] md:min-w-[220px]"
                />
                </>
              ))}
            </div>
          </div>
        ))}

      {cartProduct && (
        <AddToCartBottomBar
          product={cartProduct}
          onClose={handleCloseBottomBar}
        />
      )}
    </>
  );
};

export default HomeProducts;
