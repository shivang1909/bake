import React, { useEffect, useState } from "react";
import CardLoading from "../components/CardLoading";
import SummaryApi from "../common/SummaryApi";
import Axios from "../utils/Axios";
import AxiosToastError from "../utils/AxiosToastError";
import ProductCard from "../components/ProductCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { useLocation } from "react-router-dom";
import noDataImage from "../assets/nothing here yet.webp";
import OfferBanner from "../../assets/images/Custom/Offer_banner.webp";
import OfferBanner2 from "../../assets/images/Custom/Offer_banner_2.webp";
import OfferBanner3 from "../../assets/images/Custom/Offer_banner_3.gif";
import OfferBanner4 from "../../assets/images/Custom/Offer_banner_4.webp";
import SelectFood from "../../assets/images/Custom/SelectFood.gif";
import AddToCartBottomBar from "../components/AddToCartBottomBar";
import Search from "../components/Search";
// import Lottie from "lottie-react";
// import SearchJson from "../../assets/images/Custom/SearchFood.json";


const SearchPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
    const [cartProduct, setCartProduct] = useState(null);
    
 


  const params = useLocation();
  const queryParams = new URLSearchParams(params.search);
  const searchText = queryParams.get("q") || "";


  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.searchProduct,
        data: {
          search: searchText,
          page: page,
        },
      });


      const { data: responseData } = response;
      if (responseData.success) {
        setData((prev) =>
          page === 1 ? responseData.data : [...prev, ...responseData.data]
        );
        setTotalPage(responseData.totalPage);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    setPage(1); // Reset to first page when search changes
    setData([]); // Clear previous results
    fetchData();
  }, [searchText]);


  const handleFetchMore = () => {
    if (page < totalPage) {
      setPage((prev) => prev + 1);
    }
  };
 
  const handleCloseBottomBar = () => {
    setCartProduct(null);
  };


  return (
    <>
    <section className="bg-white font-normal mt-24 xl:mt-8">
      <span className="flex justify-center items-center xl:hidden">
       <Search/>
      </span>
      <div className="container mx-auto px-0 py-4 justify-center ">
        {searchText.trim() ? (
          <>
            <p className="font-normal text-center text-lg py-5">
               {data.length} Products
            </p>


            <InfiniteScroll
              dataLength={data.length}
              hasMore={page < totalPage}
              next={handleFetchMore}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 lg:mx-2 gap-0 md:gap-4 lg:gap-4 justify-center lg:px-28 items-center">
                {data.map((p, index) => (
                  <ProductCard
                    setCartProduct={setCartProduct}
                    product={p}
                    key={p?._id + "searchProduct" + index}
                    className="md:rounded-[15px] min-w-[150px] max-w-[200px] md:min-w-[220px] rounded-none"
                  />
                ))}


                {loading &&
                  [...Array(10)].map((_, index) => (
                    <CardLoading key={"loadingsearchpage" + index} />
                  ))}
              </div>
            </InfiniteScroll>


            {!data.length && !loading && (
              <div className="flex flex-col justify-center items-center w-full mx-auto">
                <img
                  src={SelectFood}
                  className="w-full h-full max-w-xs max-h-xs block"
                />
                <p className="font-semibold my-2">No Data found</p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <img
              src={SelectFood} // Replace with your actual image path
              alt="Search something"
              className="w-40 h-40"
            />
            <p className="text-xl font-medium mt-4">
              What are you looking for?
            </p>
            <p className="text-gray-500 mt-2 italic">
              "Discover something Testy — start searching!"
            </p>
          </div>
        )}
      </div>
      <div className="offer-banners">
        <div className="hidden lg:grid grid-cols-6 grid-rows-2 gap-4 p-10">
          <img
            src={OfferBanner3}
            alt="Offer 1"
            className="col-span-3 row-span-2 w-full h-full object-cover rounded-xl transition-all duration-300 active:scale-95 cursor-pointer"
          />
          <img
            src={OfferBanner2}
            alt="Offer 2"
            className="col-span-3 row-span-1 w-full h-full object-cover rounded-xl transition-all duration-300 active:scale-95 cursor-pointer"
          />
          <img
            src={OfferBanner3}
            alt="Offer 3"
            className="col-span-1 row-span-1 w-full h-full object-cover rounded-xl transition-all duration-300 active:scale-95 cursor-pointer"
          />
          <img
            src={OfferBanner4}
            alt="Offer 4"
            className="col-span-2 row-span-1 w-full h-full object-cover rounded-xl transition-all duration-300 active:scale-95 cursor-pointer"
          />
        </div>


        <div className="sm:block md:hidden lg:hidden grid grid-cols-6 gap-3 p-4">
          <div className="col-span-6 h-[160px] bg-gray-300 rounded-xl flex items-center justify-center text-sm text-gray-700">
            360×160
          </div>
          <div className="col-span-3 h-[110px] bg-gray-300 rounded-xl flex items-center justify-center text-sm text-gray-700">
            180×110
          </div>
          <div className="col-span-3 h-[110px] bg-gray-300 rounded-xl flex items-center justify-center text-sm text-gray-700">
            180×110
          </div>
          <div className="col-span-4 h-[130px] bg-gray-300 rounded-xl flex items-center justify-center text-sm text-gray-700">
            240×130
          </div>
          <div className="col-span-2 h-[130px] bg-gray-300 rounded-xl flex items-center justify-center text-sm text-gray-700">
            120×130
          </div>
        </div>


        <div className="hidden md:grid lg:hidden grid-cols-6 gap-4 p-6">
          <div className="col-span-6 h-[180px] bg-gray-300 rounded-xl flex items-center justify-center text-sm text-gray-700">
            260×180
          </div>
          <div className="col-span-4 h-[180px] bg-gray-300 rounded-xl flex items-center justify-center text-sm text-gray-700">
            260×180
          </div>
          <div className="col-span-2 h-[180px] bg-gray-300 rounded-xl flex items-center justify-center text-sm text-gray-700">
            130×180
          </div>


          <div className="col-span-3 h-[140px] bg-gray-300 rounded-xl flex items-center justify-center text-sm text-gray-700">
            195×140
          </div>
          <div className="col-span-3 h-[140px] bg-gray-300 rounded-xl flex items-center justify-center text-sm text-gray-700">
            195×140
          </div>
        </div>
      </div>
    </section>


    {cartProduct && (
        <AddToCartBottomBar
          product={cartProduct}
          onClose={handleCloseBottomBar}
        />
      )}


   </>
  );
};


export default SearchPage;
