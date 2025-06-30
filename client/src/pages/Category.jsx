import  { useEffect, useRef, useState } from "react";
import { FaShippingFast, FaGlobe, FaLeaf } from "react-icons/fa";
import { BiTimeFive } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import ProductCard from "../components/ProductCard";
import AddToCartBottomBar from "../components/AddToCartBottomBar";
import Breadcrumbs from "../components/Breadcrumbs";
import InfiniteScroll from "react-infinite-scroll-component";
import { GiIndiaGate } from "react-icons/gi";
import { FaArrowUp, FaTruckFast } from "react-icons/fa6";
import { TfiLayoutListThumbAlt } from "react-icons/tfi";
import { IoGrid } from "react-icons/io5";
import ListProductCardComponent from "../components/ListProductCard";
import RingLoader from "./RingLoader";

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
    const navigate = useNavigate();
 
  const [catproducts, setcatproducts] = useState([]);
  const [cartProduct, setCartProduct] = useState(null);
  const [categoryId, setcategoryId] = useState();
  const [totalPage, settotalPage] = useState();
  const [isListView, setIsListView] = useState(false);
 
  const handleCloseBottomBar = () => {
    setCartProduct(null);
  };


  const [page, setPage] = useState(1);
  const ref = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
      const [loading, setLoading] = useState(true);
      const [minDuration,setMinDuration] = useState(true);
  const pendingTasks = useRef(0);


useEffect(() => {

    const initialScroll = () =>{
      document.body.scrollTo({ top: 0});
    }

    const handleScroll = () => {
      setShowScrollTop(document.body.scrollTop > 200); // show button after 200px scroll
    };

     const timeOutId = setTimeout(() => {
      setMinDuration(false)
    }, 1000);

    initialScroll();

    document.body.addEventListener("scroll", handleScroll);
       return () => {
      document.body.removeEventListener("scroll", handleScroll);
      clearTimeout(timeOutId);
    } 
  }, []);

      const registerTask = () => pendingTasks.current++;

      const markDone = () => {
    pendingTasks.current--;
    if (pendingTasks.current === 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLoading(false);
        });
      });
    }
  };

  const scrollToTop = () => {
    document.body.scrollTo({ top: 0, behavior: "smooth" });
  };


  const params = useParams();
  const fullCategoryParam = params?.Category || "";


  const categoryNameSlug = fullCategoryParam.split("-").slice(0, -1).join("-");


 const fetchproductbycategory = async () => {
  const isFirstLoad = page === 1;
  if(isFirstLoad)
    registerTask();
    try
    {


      const response = await Axios({
        ...SummaryApi.getProductByCategory,
        data: { id: categoryId, page: page },
      });
      const data = response.data;
    
     
      setcatproducts((prev) => [...prev, ...response.data.data.product]);
      const TotalP =
        response.data.data.totalCount % 10 !== 0
          ? response.data.data.totalCount / 10 + 1
          : response.data.data.totalCount / 10;
      settotalPage(TotalP);
      setPage((prevPage) => prevPage + 1);
    }
    catch(err)
    {
        const message = err?.response?.data?.message;

       
      if(message === "Category not found" || message === "provide category id")
      {
       
          navigate("/NotFound", { replace: true });
      }
       
    }finally{
      if(isFirstLoad)
        markDone();
    }
  };




  useEffect(() => {
    setcatproducts([]);
    setPage(1);
    

    setcategoryId(fullCategoryParam.split("-").slice(-1)[0]);
  }, [fullCategoryParam]);


  useEffect(() => {
   
    categoryId && fetchproductbycategory();
  }, [categoryId]);


  const hasmoredata = () => {
   
    if (page > totalPage) {
      return false;
    } else {
      return true;
    }
  };


  return (
    <>
    {(loading||minDuration)&&<RingLoader/>}
      <div className=" min-h-fit py-8 mt-20">
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


          <div className="flex gap-2 items-center text-gray-700">
            <Breadcrumbs />
          </div>
          {/* <p className="font-semibold text-lg">30 Products</p> */}
        </div>
        <div className="mt-5">
          <div className="bg-white py-3 w-full flex justify-center">
            <div className="flex md:flex-row md:flex md:max-w-2xl gap-6 justify-between  max-w-4xl w-full px-4">
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


        <div className="lg:hidden sm:block flex flex-col-reverse md:flex-row justify-between px-3 md:gap-3 md:mb-5 md:mx-4 py-5">
          <div className="filters flex gap-3 w-full justify-between items-center rounded-full bg-gray-50 border border-gray-200  shadow-inner py-3 px-3 p-2 md:py-1">
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
          scrollableTarget="infinitebody"
        >
          <div className={
            isListView
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:gap-3 px-3"
              :
            `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 md:gap-5 justify-center items-center px-3 md:px-5 lg:px-18 [@media(width:1280px)]:px-18 xl:px-44`}>
          {/* grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 justify-center items-center md:px-5 lg:px-44 lg:gap-10 px-3 */}
            {catproducts.length > 0 &&
              catproducts.map((product, index) =>
                isListView ? (
                  <ListProductCardComponent
                    key={product._id}
                    product={product}
                    setCartProduct={setCartProduct}
                  />
                ) : (
                  
                    <ProductCard
                      product={product}
                      setCartProduct={setCartProduct}
                      key={product._id}
                      className="md:max-w-[200px] md:min-w-[220px]"
                    />
                  
                )
              )}
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
        />
      )}
    </>
  );
};


export default Category;