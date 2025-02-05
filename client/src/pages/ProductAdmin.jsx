import React, { useEffect, useState } from "react";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import Loading from "../components/Loading";
import ProductCardAdmin from "../components/ProductCardAdmin";
import { IoSearchOutline } from "react-icons/io5";
import noDataImage from "../assets/nothing here yet.webp"; // Import the image for "No Data Found"
// import { useSelector } from "react-redux";
import { setAllProduct } from '../store/productSlice';
import { useDispatch, useSelector } from "react-redux";

const ProductAdmin = () => {

  const [productData, setProductData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("name"); // "name" or "category"

  const dispatch = useDispatch();
  const allProduct = useSelector(state => state.product.Allproduct)
console.log(allProduct);

const fetchProductData = async () => {
    try {
      // setLoading(true);
    console.log("fetch called");
      const requestData = {
        page,
        limit: 12,
      };

      if (search.length >= 3) {
        if (searchType === "name") {
          requestData.search = search; // Search by product name
        } else if (searchType === "category") {
          requestData.categoryName = search; // Search by category name (e.g., "Sweet" or "Namkeen")
        }
      }

      const response = await Axios({
        ...(searchType === "name" ? SummaryApi.getProduct : SummaryApi.getProductByCategoryName),
        data: requestData,
      });
      
      const { data: responseData } = response;

      if (responseData.success) {
        dispatch(setAllProduct(responseData.data));
        setTotalPageCount(responseData.totalNoPage || 1);
        setProductData(allProduct);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
    setProductData(allProduct); 
  }, [page, search]); // Trigger on page change and search value change

  const handleNext = () => {
    if (page !== totalPageCount) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleOnChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search change
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search.length >= 3 || search.length === 0) {
        fetchProductData();
      }
    }, 300); // Debounce API call

    return () => clearTimeout(timeout);
  }, [search, searchType]);

  return (
    <section className="">
      <div className="p-2 bg-white shadow-md flex items-center justify-between gap-4">
        <h2 className="font-semibold">Product</h2>

        {/* Dropdown for search type selection */}
        <select
          className="border p-2 rounded bg-white"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="name">Search by Product Name</option>
          <option value="category">Search by Category</option>
        </select>

        {/* Search input field */}
        <div className="h-full min-w-24  w-full ml-auto bg-blue-50 px-4 flex items-center gap-3 py-2 rounded border focus-within:border-primary-200">
          <IoSearchOutline size={25} />
          <input
            type="text"
            placeholder={searchType === "name" ? "Search by name..." : "Enter category name... (Sweet or Namkeen)"}
            className="h-full w-full outline-none bg-transparent"
            value={search}
            onChange={handleOnChange}
          />
        </div>
      </div>

      {loading && <Loading />}

      <div className="p-4 bg-blue-50">
        <div className="min-h-[55vh]">
          {/* {console.log(productData)} */}
          
          {/* Check if productData is empty */}

          {/* Change this productData to allProduct */}
          {console.log(allProduct)}
          {allProduct.length === 0 && !loading && (
            <div className="flex flex-col justify-center items-center w-full mx-auto">
              <img
                src={noDataImage}
                className="w-full h-full max-w-xs max-h-xs block"
                alt="No Data"
              />
              <p className="font-semibold my-2">No Data Found</p>
            </div>
          )}
          
          {/* Display Products */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allProduct.map((p) => (
              // <ProductCardAdmin key={p.id} data={p} fetchProductData={fetchProductData} />
              <ProductCardAdmin key={p.id} data={p}/>
          ))}
          </div>
        </div>

        <div className="flex justify-between my-4">
          <button onClick={handlePrevious} className="border border-primary-200 px-4 py-1 hover:bg-primary-200">
            Previous
          </button>
          <button className="w-full bg-slate-100">
            {page}/{totalPageCount}
          </button>
          <button onClick={handleNext} className="border border-primary-200 px-4 py-1 hover:bg-primary-200">
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductAdmin;
