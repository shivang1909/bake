import React, { useEffect, useRef, useState } from "react";
import { FaShippingFast, FaGlobe, FaLeaf } from "react-icons/fa";
import { BiTimeFive } from "react-icons/bi";
import { useParams } from "react-router-dom";
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
import { TfiLayoutListThumbAlt } from "react-icons/tfi";
import { IoGrid } from "react-icons/io5";
import ListProductCardComponent from "../components/ListProductCard";
import { IoHeart } from "react-icons/io5";



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
  const [catproducts, setcatproducts] = useState([]);
  const [cartProduct, setCartProduct] = useState(null);
  const [categoryId, setcategoryId] = useState();
  const [totalPage, settotalPage] = useState();
  const [isListView, setIsListView] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)"); // lg = 1024px
  
    // Set initial value
    setIsListView(mediaQuery.matches); // true for md/sm, false for lg+
  
    // Listener for resize
    const handler = (e) => setIsListView(e.matches);
    mediaQuery.addEventListener("change", handler);
  
    // Cleanup
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  const handleCloseBottomBar = () => {
    setCartProduct(null);
  };

  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const allProduct = useSelector((state) => state.product.Allproduct);
  const ref = useRef(null);
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

  const params = useParams();
  const fullCategoryParam = params?.Category || "";

  const categoryNameSlug = fullCategoryParam.split("-").slice(0, -1).join("-");

  const fetchproductbycategory = async () => {
    const response = await Axios({
      ...SummaryApi.getProductByCategory,
      data: { id: categoryId, page: page },
    });
    const data = response.data;
    console.log(categoryId);
    console.log("total products number checkujngneiowndiue");
    console.log(response.data);
    setcatproducts((prev) => [...prev, ...response.data.data.product]);
    const TotalP =
      response.data.data.totalCount % 10 !== 0
        ? response.data.data.totalCount / 10 + 1
        : response.data.data.totalCount / 10;
    settotalPage(TotalP);
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    setcatproducts([]);
    setPage(1);

    setcategoryId(fullCategoryParam.split("-").slice(-1)[0]);
  }, [fullCategoryParam]);

  useEffect(() => {
    console.log("before fetchproductbycategory functionnnn");
    categoryId && fetchproductbycategory();
  }, [categoryId]);

  const hasmoredata = () => {
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
        <div className=" flex flex-col items-center text-center space-y-2">
          <span
            className="text-5xl md:text-7xl font-thin text-[#1e293b] flex justify-center items-center gap-2"
            style={{ fontFamily: "Bartex, sans-serif" }}
          >
            {/* <span className="text-yellow-600 text-3xl">💮</span> */}
            {categoryNameSlug}
            {/* <span className="text-yellow-600 text-3xl">💮</span> */}
          </span>

          <p className="flex gap-2 items-center text-gray-700">
            <Breadcrumbs />
          </p>
          {/* <p className="font-semibold text-lg">30 Products</p> */}
        </div>
        <div className="mt-10">
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
        </div>

        <div className="lg:hidden sm:block flex flex-col-reverse md:flex-row justify-between md:gap-3 md:mb-5 md:mx-4">
          <div className="filters flex gap-3 w-full justify-between items-center bg-gray-50 border border-gray-200  shadow-inner py-3 px-3 p-2 md:py-1">
            <div>
              <span className="flex gap-2 items-center text-gray-700 text-sm font-semibold">
               A Box of joy is just scroll away 💌
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

        <InfiniteScroll
          dataLength={catproducts.length}
          hasMore={hasmoredata}
          next={fetchproductbycategory}
          className="lg:py-5"
        >
          <div className={
            isListView
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:gap-3"
              :
            `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-center items-center md:px-5 lg:px-44 lg:gap-10`}>
            {catproducts.length > 0 &&
              catproducts.map((product, index) =>
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
                      key={product._id}
                      className="min-w-[200px] max-w-[200px] md:min-w-[220px]"
                    />
                  </>
                )
              )}
          </div>
        </InfiniteScroll>
        <button
          onClick={scrollToTop}
          className={`fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-slate-950/80 backdrop-blur-lg text-white p-3 shadow-lg transition-all duration-300 hover:bg-slate-800 hover:scale-110 active:scale-90 ${
            showScrollTop ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <FaArrowUp className="w-full h-full" />
        </button>
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
