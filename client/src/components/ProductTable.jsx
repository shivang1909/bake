import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoSearchOutline } from "react-icons/io5";
import { FaEdit, FaTrash } from "react-icons/fa";
import { setAllProduct } from "../store/productSlice";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";

const ProductTable = () => {
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("name");
  const [page, setPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState(1);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const allProduct = useSelector((state) => state.product.Allproduct || []);
  const fetchProducts = async () => {
      if (page > totalPageCount && page !== 1) return;
      
      try {
          setLoading(true);
          const requestData = {
        page,
        limit: 12,
      };

      const response = await Axios({
        ...(searchType === "name" ? SummaryApi.getProduct : SummaryApi.getProductByCategoryName),
        data: requestData,
      });

      const { data: responseData } = response;
      
      if (responseData.success) {
          console.log(responseData.data)
          const newProducts = responseData.data;
          if (page === 1) {
              dispatch(setAllProduct(newProducts));
            } else {
                dispatch(setAllProduct([...allProduct, ...newProducts]));
            }
            setTotalPageCount(responseData.totalNoPage || 1);
            setPage((prev) => prev + 1);
        }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setTimeout(() => setLoading(false), 2000); // Show skeleton for 2 sec
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      if (search.length >= 3) {
        fetchProducts();
      }
      if (search.length === 0) {
        fetchProducts();
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, searchType]);

  return (
    <section className="p-4 bg-gray-50">
      <div className="p-2 bg-white shadow-md flex items-center justify-between gap-4 rounded-lg">
        <h2 className="font-semibold text-lg">Product List</h2>

        <select
          className="border p-2 rounded bg-white text-sm"
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
        >
          <option value="name">Search by Product Name</option>
          <option value="category">Search by Category</option>
        </select>

        <div className="relative flex items-center bg-white border rounded-md px-3 py-2 w-80">
          <IoSearchOutline size={20} className="text-gray-500" />
          <input
            type="text"
            placeholder={searchType === "name" ? "Search by name..." : "Enter category name..."}
            className="ml-2 w-full outline-none text-sm bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="w-full border-collapse">
          <thead className="bg-blue-500 text-white text-sm uppercase">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">SKU</th>
              <th className="py-3 px-4 text-center">Cover Image</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Discount</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b animate-pulse">
                    <td className="py-3 px-4 bg-gray-200 h-6"></td>
                    <td className="py-3 px-4 bg-gray-200 h-6"></td>
                    <td className="py-3 px-4 bg-gray-200 h-6"></td>
                    <td className="py-3 px-4 bg-gray-200 h-6"></td>
                    <td className="py-3 px-4 bg-gray-200 h-6"></td>
                    <td className="py-3 px-4 bg-gray-200 h-6"></td>
                  </tr>
                ))
              : allProduct.length > 0
              ? allProduct.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-100">
                    <td className="py-3 px-4">{product.name}</td>
                    <td className="py-3 px-4">{product.sku}</td>
                    <td className="py-3 px-4 text-center">
                      <img
                        src={product.coverimage}
                        alt="cover"
                        className="w-12 h-12 rounded-md object-cover border"
                      />
                    </td>
                 
                    <td className="py-3 px-4">{product.category?.name}</td>
                    <td className="py-3 px-4">{product.discount}%</td>
                    <td className="py-3 px-4 text-center">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">
                        <FaEdit size={18} />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              : (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">
                    No products found
                  </td>
                </tr>
              )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProductTable;
