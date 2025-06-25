import React, { useEffect, useRef, useState } from "react";
import { FaShippingFast, FaGlobe, FaLeaf } from "react-icons/fa";
import { BiTimeFive } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import ProductCard from "../components/ProductCard";
import ProductLoader from "../components/ProductLoader";
import AddToCartBottomBar from "../components/AddToCartBottomBar";
import Breadcrumbs from "../components/Breadcrumbs";
import { setAllCategory, setAllProduct } from "../store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import shapegrey from "../../assets/images/Custom/shape-grey.png";
import { GiDuration, GiIndiaGate } from "react-icons/gi";
import { FaArrowUp, FaTruckFast } from "react-icons/fa6";
import { IoGrid } from "react-icons/io5";
import { TfiLayoutListThumbAlt } from "react-icons/tfi";
import ListProductCardComponent from "../components/ListProductCard";

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

const Featured = () => {
      const navigate = useNavigate();
  
  const [FeaturedProduct, setFeaturedProduct] = useState([]);
  const [FeaturedId, setFeaturedId] = useState();
  const [cartProduct, setCartProduct] = useState(null);
  const [totalPage, setTotalPage] = useState(null);
   const [isListView, setIsListView] = useState(false);
    
  const handleCloseBottomBar = () => {
    setCartProduct(null);
  };
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200); // show button after 200px scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const allProduct = useSelector((state) => state.product.Allproduct);
  const ref = useRef(null);

  const params = useParams();
  const fullFeaturedParam = params?.Featured || "";

  const FeaturedNameSlug = fullFeaturedParam.split("-").slice(0, -1).join("-");

const FetchFeaturedProduct = async () => {
    try
    {
    const response = await Axios({
      ...SummaryApi.getFeaturedProduct,
      data: { sectionId: FeaturedId, page: page },
    });
    console.log(response.data);
    console.log("above");
    setFeaturedProduct((prev) => [...prev, ...response.data.data]);
    setPage((prevPage) => prevPage + 1);
    setTotalPage(response.data.totalNoPage);
    }
    catch(error)
    {
       const message = error?.response?.data?.message;
       console.log("this is error",message);
       
       
      if(message === "No products found for this section")
      {
       
          navigate("/NotFound", { replace: true });
      }
      console.log(error);


    }
  };


  useEffect(() => {
    setPage(1);
    setFeaturedProduct([]);
    setFeaturedId(fullFeaturedParam.split("-").slice(-1)[0]);
  }, [fullFeaturedParam]);

  useEffect(() => {
    if (!FeaturedId) return;
    FetchFeaturedProduct();
  }, [FeaturedId]);

  const hasmoredata = async () => {
    console.log("Checking if more data is available for page:", page);
    if (page > totalPage) {
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      <div className=" min-h-screen py-8 mt-20">
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
        <div className=" flex flex-col items-center text-center space-y-2 mb-5">
          <span
            className="text-5xl md:text-7xl font-thin text-[#1e293b] flex justify-center items-center gap-2"
            style={{ fontFamily: "Bartex, sans-serif" }}
          >
            {/* <span className="text-yellow-600 text-3xl">💮</span> */}
            {FeaturedNameSlug}
            {/* <span className="text-yellow-600 text-3xl">💮</span> */}
          </span>

          <p className="flex gap-2 items-center text-gray-700">
            <Breadcrumbs />
          </p>
          {/* <p className="font-semibold text-lg">30 Products</p> */}
        </div>

        {/* <img src={shapegrey} alt="" className="lg:mt-28  w-full" /> */}
        <div className="bg-white py-3 w-full flex justify-center">
          <div className="flex md:flex-row md:flex gap-6 justify-between  max-w-4xl w-full px-4">
            {/* Icon 2 */}
            <div className="flex flex-col space-y-2 justify-center items-center whitespace-nowrap">
              <div className="text-orange-600 text-4xl md:text-6xl bg-white border border-orange-300 border-dotted px-3 py-3 rounded-full">
                <FaTruckFast />
              </div>
              <span className="text-xs font-semibold text-center">
                Delivery <br /> within 1-2 Days
              </span>
            </div>

            {/* Icon 3 */}
            <div className="flex flex-col space-y-2 justify-center items-center whitespace-nowrap">
              <div className="text-orange-600 text-4xl md:text-6xl bg-white border border-orange-300 border-dotted px-3 py-3 rounded-full">
                <GiIndiaGate />
              </div>
              <span className="text-xs font-semibold text-center">
                Free <br /> Shipping
              </span>
            </div>

            {/* Icon 4 */}
            <div className="flex flex-col space-y-2 justify-center items-center whitespace-nowrap">
              <div className="text-orange-600 text-4xl md:text-6xl bg-white border border-orange-300 border-dotted px-3 py-3 rounded-full">
                <FaLeaf />
              </div>
              <span className="text-xs font-semibold text-center">
                No any <br /> Preservatives
              </span>
            </div>
          </div>
        </div>

             <div className="lg:hidden sm:block flex flex-col-reverse md:flex-row justify-between px-3  md:gap-3 md:mb-5 md:mx-4 py-5">
                      <div className="filters flex gap-3 w-full justify-between items-center rounded-full bg-gray-50 border border-gray-200  shadow-inner py-3 px-3 p-2 md:py-1">
                        <div>
                          <span className="text-gray-700 text-sm font-semibold">
                            Special Moment, Sweeter Bites ♥️
                          </span>
                        </div>
                        <div className="grid-list-buttons">
                          <button
                            onClick={() => setIsListView(!isListView)}
                            title={
                              isListView ? "Switch to Card View" : "Switch to List View"
                            }
                          >
                            {isListView ? (
                              <IoGrid className="text-2xl text-gray-700  transition-all duration-300 active:scale-95" />
                            ) : (
                              <TfiLayoutListThumbAlt className="text-2xl text-gray-700 transition-all duration-300 active:scale-95" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

        {/* <img src={shapegrey} alt="" className="w-full rotate-180" /> */}
        <InfiniteScroll
          dataLength={FeaturedProduct.length}
          hasMore={hasmoredata}
          next={FetchFeaturedProduct}
          className="lg:py-3"
        >
          {console.log(allProduct)}
          <div className={
            isListView
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:gap-3 px-3"
              :
            `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-center items-center px-3 md:px-5 lg:px-44 lg:gap-10`}>
            
            {FeaturedProduct.map((product, index) => 
              isListView ? (
                <ListProductCardComponent
                  key={product._id}
                  product={product}
                  setCartProduct={setCartProduct}
                />
              ) : (
                <>
                 {console.log(allProduct)}
                <ProductCard
                  product={product}
                  setCartProduct={setCartProduct}
                    className="md:max-w-[200px] md:min-w-[220px]"
                />
                </>
            ))}

          </div>
        </InfiniteScroll>
      <button
                  onClick={scrollToTop}
                  className={`fixed bottom-5 right-5 z-40 w-[55px] h-[55px] rounded-full bg-gray-50/80 border border-gray-200 backdrop-blur-sm text-white p-3 shadow-inner transition-all duration-300 hover:bg-gray-100 hover:scale-110 active:scale-90 ${
                    showScrollTop ? "opacity-100 visible" : "opacity-0 invisible"
                  }`}
                >
                  <FaArrowUp className="w-full h-full text-orange-500" />
                </button>
      </div>
      {cartProduct && (
        <AddToCartBottomBar
          reference={ref}
          product={cartProduct}
          onClose={handleCloseBottomBar}
          activeIndex={0}
        />
      )}
    </>
  );
};

export default Featured;
