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
import { FaTruckFast } from "react-icons/fa6";


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
  const [FeaturedProduct, setFeaturedProduct]=useState([]);
  const [FeaturedId, setFeaturedId]=useState();
  const [cartProduct, setCartProduct] = useState(null);
  const [totalPage, setTotalPage] = useState(null);
  const handleCloseBottomBar = () => {
    setCartProduct(null);
  };

  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const allProduct = useSelector((state) => state.product.Allproduct);
  const ref = useRef(null);

  const params = useParams();
  const fullFeaturedParam = params?.Featured || "";
 
  const FeaturedNameSlug = fullFeaturedParam.split("-").slice(0, -1).join("-");



  const FetchFeaturedProduct = async () => {
    console.log(FeaturedId)
    const response = await Axios({
      ...SummaryApi.getFeaturedProduct,
      data: { sectionId: FeaturedId , page:page},
    });
    console.log(response.data)
    console.log("above")
    setFeaturedProduct((prev)=>[...prev,...response.data.data])
    setPage((prevPage) => prevPage + 1);
    setTotalPage(response.data.totalNoPage)

  };

  useEffect(() => {
    setPage(1)
    setFeaturedProduct([])
    setFeaturedId(fullFeaturedParam.split("-").slice(-1)[0])
  }, [fullFeaturedParam]);

  useEffect(()=>{
    if(!FeaturedId) return;
    FetchFeaturedProduct();
  },[FeaturedId])

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
        <div className=" flex flex-col items-center text-center space-y-2 mb-10">
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

         <img src={shapegrey} alt="" className="lg:mt-28  w-full" />
              <div className="bg-[#FAF7F2] py-10 w-full flex justify-center">
                <div className="grid grid-cols-2 md:flex gap-6 justify-between max-w-4xl w-full px-4">
                  {/* Icon 1 */}
                  <div className="flex flex-col space-y-2 justify-center items-center whitespace-nowrap">
                    <div className="text-orange-600 text-6xl bg-white border border-orange-300 border-dotted px-3 py-3 rounded-full">
                      <GiDuration />
                    </div>
                    <span className="text-xs font-semibold text-center">
                     Days Of
                      <br /> Shelf Life
                    </span>
                  </div>
        
                  {/* Icon 2 */}
                  <div className="flex flex-col space-y-2 justify-center items-center whitespace-nowrap">
                    <div className="text-orange-600 text-6xl bg-white border border-orange-300 border-dotted px-3 py-3 rounded-full">
                      <FaTruckFast />
                    </div>
                    <span className="text-xs font-semibold text-center">
                      Delivery Within <br /> 1-2 Days
                    </span>
                  </div>
        
                  {/* Icon 3 */}
                  <div className="flex flex-col space-y-2 justify-center items-center whitespace-nowrap">
                    <div className="text-orange-600 text-6xl bg-white border border-orange-300 border-dotted px-3 py-3 rounded-full">
                      <GiIndiaGate />
                    </div>
                    <span className="text-xs font-semibold text-center">
                      Free <br /> Shipping
                    </span>
                  </div>
        
                  {/* Icon 4 */}
                  <div className="flex flex-col space-y-2 justify-center items-center whitespace-nowrap">
                    <div className="text-orange-600 text-6xl bg-white border border-orange-300 border-dotted px-3 py-3 rounded-full">
                      <FaLeaf />
                    </div>
                    <span className="text-xs font-semibold text-center">
                      No any <br /> Preservatives
                    </span>
                  </div>
                </div>
              </div>
        
              <img src={shapegrey} alt="" className="w-full rotate-180" />
        <InfiniteScroll
          dataLength={FeaturedProduct.length}
          hasMore={hasmoredata}
          next={FetchFeaturedProduct}
          className="py-3"
        >
          {console.log(allProduct)}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-5 justify-center items-center px-5 lg:px-32  lg:gap-10">
            {FeaturedProduct.map((product, index) => (
              <>
              {console.log(allProduct)}
              <ProductCard product={product} setCartProduct={setCartProduct} />
              </>
            ))}
          </div>
        </InfiniteScroll>
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

export default Featured;
