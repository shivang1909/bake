import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import ProductCardAdmin from "../components/ProductCardAdmin";
import ProductCardSkeleton from "../components/ProductCardSkeleton";
import { IoSearchOutline } from "react-icons/io5";
import noDataImage from "../assets/nothing here yet.webp";
import { setAllProduct, addProduct } from '../store/productSlice'; // Import the new action
import { useDispatch, useSelector } from "react-redux";
import ProductForm from "../components/ProductForm";

const ProductAdmin1 = () => {
  const [openUploadProduct, setOpenUploadProduct] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [showSkeleton, setShowSkeleton] = useState(false);
  
  const dispatch = useDispatch();
  const allProduct = useSelector(state => state.product.Allproduct || []);
  // console.log(allProduct);
  const fetchbysearch = async () => {
    dispatch(setAllProduct([]));
   console.log("i am in serach function")
   var  pages = 1;

   const requestData = {
      pages,
      limit: 1000, // Number of products per request
    };  

    if (searchType === "name") {
        requestData.search = search;
      } else if (searchType === "category") {
        console.log("i am in else if");
        requestData.categoryName = search;
      }
    const response = await Axios({
      ...(searchType === "name" ? SummaryApi.getProduct : SummaryApi.getProductByCategoryName),
      data: requestData,
    });
    const { data: responseData } = response;

    console.log(responseData.data);

    dispatch(setAllProduct(responseData.data));
   


  };
  const fetchProductData = async () => {

    if (page > totalPageCount && page !== 1) return;
    console.log("i am here ")
    try {
      setShowSkeleton(true);

      const requestData = {
        page,
        limit: 12, // Number of products per request
      };

      
      console.log(requestData);
      const response = await Axios({
        ...(searchType === "name" ? SummaryApi.getProduct : SummaryApi.getProductByCategoryName),
        data: requestData,
      });

      const { data: responseData } = response;
      
      
      if (responseData.success) {
        console.log("this is response whihch i got from api",responseData.data);
        const newProducts = responseData.data;
        
        if (page === 1) {
          // Replace the product list when it's the first page
          
          dispatch(setAllProduct(newProducts));
        } else {
            // Append new products to the existing list
            
            dispatch(setAllProduct([...allProduct, ...newProducts]));
          }
          
          setTotalPageCount(responseData.totalNoPage || 1);
          setPage(prev => prev + 1);
               // Delay hiding the skeleton for 2 seconds
      setTimeout(() => {
        setShowSkeleton(false);
      }, 2000);
        }
      
    } catch (error) {
      AxiosToastError(error);
      setShowSkeleton(false);
    }
  };

  // useEffect(() => {
  //   // Reset products and page when search or searchType changes
  //   console.log("i am in  use effect ");
  
  //   dispatch(setAllProduct([])); // Clear products
  //   setPage(1);
  //   fetchProductData();
      
  // }, [search, searchType]);

  
  useEffect(() => {
    // Debounce logic
    const timeout = setTimeout(() => {
      
      // Reset products and page only when search or searchType changes
      // dispatch(setAllProduct([])); // Clear products
      setPage(1); // Reset page to 1
      if (search.length >= 3 ) {
        console.log("Fetching data for search:", search);
        fetchbysearch()

      }
      if(search.length === 0)
      {

         fetchProductData(); // Fetch new data
      }
    }, 300); // 300ms debounce delay
  
    // Cleanup function to clear the timeout
    return () => clearTimeout(timeout);
  }, [search, searchType]);
 

  return (
    <section>
      <div className="p-2 bg-white shadow-md flex items-center justify-between gap-4">
        <h2 className="font-semibold">Product</h2>

        <select
          className="border p-2 rounded bg-white"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="name">Search by Product Name</option>
          <option value="category">Search by Category</option>
        </select>

        <div className="h-full min-w-24 w-full ml-auto bg-blue-50 px-4 flex items-center gap-3 py-2 rounded border focus-within:border-primary-200">
          <IoSearchOutline size={25} />
          <input
            type="text"
            placeholder={searchType === "name" ? "Search by name..." : "Enter category name..."}
            className="h-full w-full outline-none bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <button 
            onClick={() => setOpenUploadProduct(true)} 
            className="text-sm border border-primary-200 hover:bg-primary-200 px-3 py-1 rounded"
          >
            Add Product
          </button>
        </div>
      </div>

      {openUploadProduct && (
        <ProductForm 
          close={() => setOpenUploadProduct(false)} 
           // Pass the handleAddProduct function
        />
      )}

      <div className="p-4 bg-blue-50 overflow-y-auto">
        <div className="min-h-[55vh]">
          {allProduct.length === 0 && !showSkeleton && (
            <div className="flex flex-col justify-center items-center w-full mx-auto">
              <img src={noDataImage} className="w-full h-full max-w-xs max-h-xs block" alt="No Data" />
              <p className="font-semibold my-2">No Data Found</p>
            </div>
          )}

          {!openUploadProduct && (
            <div id="scrollableDiv" className="h-[60vh] overflow-y-auto">
              <InfiniteScroll
                scrollableTarget="scrollableDiv"
                dataLength={allProduct.length}
                next={fetchProductData}
                hasMore={page <= totalPageCount}
                loader={null}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {/* Display products */}
                  {allProduct.map((p) => (
                    <ProductCardAdmin key={p.id} data={p} />
                  ))}

                  {/* Display skeleton loader */}
                  {showSkeleton &&
                    Array.from({ length: 18 }).map((_, index) => (
                      <ProductCardSkeleton key={index} />
                    ))}
                </div>
              </InfiniteScroll>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductAdmin1;