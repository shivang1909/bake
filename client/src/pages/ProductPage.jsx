import React, { Fragment, useEffect, useRef, useState } from "react";
import AddtoCartBottomBar from "../components/AddToCartBottomBar";
import { RxCross2 } from "react-icons/rx";
import {
  Menu,
  Transition,
} from "@headlessui/react";
import { IoGrid } from "react-icons/io5";
import { TfiLayoutListThumbAlt } from "react-icons/tfi";
import ListProductCardComponent from "../components/ListProductCard";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelIcon,
} from "@heroicons/react/20/solid";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { setAllProduct } from "../store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import ProductLoader from "../components/ProductLoader";
import ListLoader from "../components/ListLoader";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import InfiniteScroll from "react-infinite-scroll-component";
import { IoMdTrophy } from "react-icons/io";
import { MdStarRate } from "react-icons/md";
import {
  FaSortAmountDown,
  FaSortAmountDownAlt,
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
} from "react-icons/fa";
import { BsSearch } from "react-icons/bs";

const sortOptions = [
  { name: "Best Seller", icon: <IoMdTrophy />, href: "#", current: true },
  { name: "Best Rating", icon: <MdStarRate />, href: "#", current: false },
  {
    name: "Price: Low to High",
    icon: <FaSortAmountDown />,
    href: "#",
    current: false,
  },
  {
    name: "Price: High to Low",
    icon: <FaSortAmountDownAlt />,
    href: "#",
    current: false,
  },
  { name: "A to Z", icon: <FaSortAlphaDown />, href: "#", current: false },
  { name: "Z to A", icon: <FaSortAlphaDownAlt />, href: "#", current: false },
];
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}



const ProductPage = ({ category, setMobileFiltersOpen }) => {
  const ref = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartProduct, setCartProduct] = useState(null);
  const [isListView, setIsListView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //new
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const allProduct = useSelector((state) => state.product.Allproduct);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await Axios({
        ...SummaryApi.getProduct,
        data: { page },
      });
      const data = response.data;
      // build a fast-lookup set
      const allProductIds = new Set(allProduct.map((p) => p._id));

      // filter out any product whose _id is already in allProduct
      const filteredProducts = data.data.filter(
        (p) => !allProductIds.has(p._id)
      );
      dispatch(setAllProduct((prev) => [...prev, ...filteredProducts]));
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setIsLoading(false);
  };


  useEffect(() => {
  fetchData();
  }, []);

  const hasmoredata = async () => {
    console.log("Checking if more data is available for page:", page);
    if (page > 2) {
      return false;
    } else {
      return true;
    }
  };

  const handleAddToCart = (product) => {
    setCartProduct(product);
  };

  const handleCloseBottomBar = () => {
    setCartProduct(null);
  };

  useEffect(() => {
    document.body.style.overflow = selectedProduct ? "hidden" : "auto";
  }, [selectedProduct]);
  const [focusedOrFilled, setFocusedOrFilled] = useState(false);
  const [value, setValue] = useState("");

  return (
    <div className="py-4 bg-white flex-col items-center justify-center">
      {/* View Toggle Buttons */}
      <div className="flex flex-col-reverse md:flex-row justify-between md:gap-3 md:mb-5 md:mx-4">
        {/* apllied filters section start */}
        <div className="flex gap-1 overflow-y-auto whitespace-nowrap flex-nowrap tracking-widest my-2 md:my-0">
          <span className="text-xs font-semibold py-1.5 md:py-3 px-3 bg-gray-50 rounded-full border border-gray-200  flex gap-1 justify-center items-center">
            <RxCross2 className="text-sm cursor-pointer" />
            100GM
          </span>
          <span className="text-xs font-semibold py-1.5 md:py-3 px-3 bg-gray-50 rounded-full border border-gray-200  flex gap-1 justify-center items-center">
            <RxCross2 className="text-sm cursor-pointer" />
            Sweets
          </span>
          <span className="text-xs font-semibold py-1.5 md:py-3 px-3 bg-gray-50 rounded-full border border-gray-200  flex gap-1 justify-center items-center">
            <RxCross2 className="text-sm cursor-pointer" />
            5-7 Days
          </span>
        </div>
        {/* apllied filters section end  */}

        <div className="flex">
          <div className="flex items-center px-3">
            <div
              className={`p-2 hover:w-[270px] overflow-hidden ${
                focusedOrFilled ? "w-[270px]" : "w-[50px]"
              } h-[40px] bg-gray-100 shadow-inner rounded-full flex items-center duration-300`}
            >
              <div className="flex items-center justify-center fill-white">
                <BsSearch className="text-lg ml-2 hover:rotate-90" />
              </div>
              <input
                type="text"
                className="outline-none text-[15px] bg-transparent w-full text-black font-normal px-4"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setFocusedOrFilled(
                    !!e.target.value || document.activeElement === e.target
                  );
                }}
                onFocus={() => setFocusedOrFilled(true)}
                onBlur={() => {
                  if (!value) setFocusedOrFilled(false);
                }}
              />
            </div>
          </div>
          <div className="filters flex gap-3 justify-between bg-gray-50 border border-gray-200 rounded-md shadow-inner px-3 p-2 md:py-1">
            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                {({ open }) => (
                  <>
                    <div>
                      <Menu.Button className="group inline-flex justify-center text-sm font-medium text-black hover:text-gray-900 items-center">
                        Sort
                        {open ? (
                          <ChevronUpIcon
                            aria-hidden="true"
                            className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                          />
                        ) : (
                          <ChevronDownIcon
                            aria-hidden="true"
                            className="-mr-1 ml-1 size-5 shrink-0 text-gray-400 group-hover:text-gray-500"
                          />
                        )}
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      show={open}
                      enter="transition-all duration-200 ease-out"
                      enterFrom="opacity-0 h-0"
                      enterTo="opacity-100 h-[220px]" // adjust height accordingly
                      leave="transition-all duration-150 ease-in"
                      leaveFrom="opacity-100 h-[220px]"
                      leaveTo="opacity-0 h-0"
                    >
                      <Menu.Items
                        static
                        className="overflow-hidden absolute font-medium right-0 z-10 mt-2 w-60 origin-top-right rounded-lg bg-white shadow-2xl ring-1 ring-black/5 focus:outline-hidden"
                      >
                        <div className="py-1">
                          {sortOptions.map((option) => (
                            <Menu.Item key={option.name}>
                              {({ active }) => (
                                <a
                                  href={option.href}
                                  className={classNames(
                                    option.current
                                      ? "font-medium text-gray-900 bg-gray-100"
                                      : "text-gray-500",
                                    active ? "bg-gray-50" : "",
                                    "flex items-center gap-2 px-4 py-2 text-sm"
                                  )}
                                >
                                  {option.icon}
                                  {option.name}
                                </a>
                              )}
                            </Menu.Item>
                          ))}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="-m-2 ml-4 p-2 text-gray-600 hover:text-gray-500 sm:ml-6 lg:hidden"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="size-5" />
              </button>
            </div>

            <div className="grid-list-buttons mt-1">
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
      </div>

      {/* Product Display Section */}
      <div className="">
        <InfiniteScroll
          dataLength={10}
          hasMore={hasmoredata}
          next={fetchData}
          className="py-3"
        >
          <div
            ref={ref}
            className={
              isListView
                ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 lg:gap-3"
                : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 mx-1 lg:mx-2 gap-0 md:gap-4 lg:gap-4 items-center"
            }
          >
           {
            allProduct
                  .filter((product) =>
                    !category || category.length === 0
                      ? true
                      : category.includes(product.category?._id)
                  )
                  .map((product) =>
                    isListView ? (
                      <ListProductCardComponent
                        key={product._id}
                        product={product}
                        setCartProduct={setCartProduct}
                      />
                    ) : (
                      <ProductCard
                        key={product._id}
                        product={product}
                        setCartProduct={setCartProduct}
                      />
                    )
                  )}
          </div>
        </InfiniteScroll>
      </div>

      {cartProduct && (
        <AddtoCartBottomBar
          refeernce={ref}
          product={cartProduct}
          onClose={handleCloseBottomBar}
        />
      )}
    </div>
  );
};

export default ProductPage;
