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

const Category = () => {
  const [catproducts, setcatproducts] = useState([]);
  const [cartProduct, setCartProduct] = useState(null);
  const [categoryId, setcategoryId] = useState();
  const [totalPage, settotalPage] = useState();
  const handleCloseBottomBar = () => {
    setCartProduct(null);
  };

  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const allProduct = useSelector((state) => state.product.Allproduct);
  const ref = useRef(null);

  const params = useParams();
  const fullCategoryParam = params?.Category || "";
  
  const categoryNameSlug = fullCategoryParam.split("-").slice(0, -1).join("-");

  const fetchproductbycategory = async () => {
    const response = await Axios({
      ...SummaryApi.getProductByCategory,
      data: { id: categoryId,page:page },
    });
    const data = response.data;
    console.log(categoryId)
    console.log(response.data)
    setcatproducts((prev)=>[...prev,...response.data.data.product])
    const TotalP = response.data.data.totalCount%10 !== 0?(response.data.data.totalCount/10)+1:response.data.data.totalCount/10
    settotalPage(TotalP)
    setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    setcatproducts([]);
    setPage(1);

    setcategoryId(fullCategoryParam.split("-").slice(-1)[0]);
  }, [fullCategoryParam]);


  
 

  useEffect(()=>{
    console.log("before fetchproductbycategory functionnnn")
    categoryId && fetchproductbycategory();
  },[categoryId])

  const hasmoredata =  () => {
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
<div className="hidden">
  <img src={shapegrey} alt="" className="lg:mt-20  w-full" />
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
</div>
       
        <InfiniteScroll
          dataLength={catproducts.length}
          hasMore={hasmoredata}
          next={fetchproductbycategory}
          className="py-3"
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 mt-5 justify-center items-center px-5 lg:px-32  lg:gap-10">
            {catproducts.length>0&&catproducts.map((product, index) => (
              <>
              {console.log(allProduct)}
              <ProductCard product={product} setCartProduct={setCartProduct} key={product._id} />
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

export default Category;
