import React, { Fragment, useEffect, useRef, useState } from "react";

import AddtoCartBottomBar from "../components/AddToCartBottomBar";
import { TbShoppingBagPlus } from "react-icons/tb";
import { CiBoxList } from "react-icons/ci";
import { CiGrid41 } from "react-icons/ci";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { IoGrid } from "react-icons/io5";
import { TfiLayoutListThumbAlt } from "react-icons/tfi";
import ListProductCardComponent from "../components/ListProductCard";

import {
  ChevronDownIcon,
  ChevronUpIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { setAllProduct } from "../store/productSlice";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import ProductLoader from "../components/ProductLoader";
import ListProduct from "../components/ListLoader";
import Axios from "../utils/axios";
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

// Fix image imports
// const products = [
//   {
//     id: 1,
//     name: "Haldiram's Sev ejbei ewindeio Puri",
//     category: "Snack & Munchies",
//     weight: "400g",
//     price: 55,
//     discountPrice: 25,
//     discount: "10% Off",
//     image: IndianSweet,
//     variants: ["200g", "400g", "800g"],
//   },
//   {
//     id: 3,
//     name: "Kajukatri Delight",
//     category: "Bakery & Biscuits",
//     weight: "250g",
//     price: 30,
//     discountPrice: 25,
//     discount: "10% Off",
//     image: Kajukatri,
//     variants: ["250g ", "500g ", "1kg "],
//   },
//   {
//     id: 4,
//     name: "Mix Bites Pack",
//     category: "Bakery & Biscuits",
//     weight: "250g",
//     price: 28,
//     discountPrice: 23,
//     discount: "5% Off",
//     image: Mixbites,
//     variants: ["250g ", "500g ", "1kg "],
//   },
//   {
//     id: 5,
//     name: "Barfi Classic",
//     category: "Bakery & Biscuits",
//     weight: "250g",
//     price: 32,
//     discountPrice: 27,
//     discount: "15% Off",
//     image: Barfi,
//     variants: ["250g ", "500g ", "1kg "],
//   },
//   {
//     id: 6,
//     name: "Kaju Roll Special",
//     category: "Bakery & Biscuits",
//     weight: "250g",
//     price: 35,
//     discountPrice: 30,
//     discount: "10% Off",
//     image: Kajuroll,
//     variants: ["250g ", "500g ", "1kg "],
//   },
//   {
//     id: 7,
//     name: "Indian Sweets Mix",
//     category: "Bakery & Biscuits",
//     weight: "250g",
//     price: 30,
//     discountPrice: 25,
//     discount: "5% Off",
//     image: IndianSweet,
//     variants: ["250g ", "500g ", "1kg "],
//   },
//   {
//     id: 8,
//     name: "Chocolate Promo Pack",
//     category: "Bakery & Biscuits",
//     weight: "250g",
//     price: 25,
//     discountPrice: 20,
//     discount: "5% Off",
//     image: PromoChocolate,
//     variants: ["Dark", "Milk", "Mixed"],
//   },
// ];

const ProductModal = ({ product, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (product) {
      setShow(true);
    }
  }, [product]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose();
    }, 200); // match the duration with transition time
  };

  if (!product) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#2323239c] bg-opacity-40 flex items-center justify-center px-4 ${
        show ? "opacity-100 scale-100" : "opacity-0 scale-95"
      }`}
    >
      <div
        className={`bg-white rounded-lg px-6 max-w-sm w-full relative max-h-[80vh] overflow-y-auto transform transition-all duration-200 ${
          show ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-black text-xl font-bold"
        >
          ✖
        </button>

        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-contain mb-4"
        />

        <div className="flex items-center text-yellow-500 text-sm mb-1">
          {"★".repeat(5)}
          <span className="text-black text-xs ml-2">(1)</span>
        </div>

        <h2 className="text-2xl text-left font-bold mb-1">{product.name}</h2>

        <p className="text-xl font-medium mb-2">₹{product.discountPrice}</p>

        <p className="text-gray-800 font-semibold text-sm mb-3">
          Weight: 325gm/550gm <br /> <br /> Each bite of Mohanthal (Mohanthar)
          is a symphony of textures and tastes. The richness of ghee adds a
          luxurious touch, making Mohanthal a truly indulgent delight. Available
          in different…
        </p>

        <p className="text-xs font-semibold mb-1">WEIGHT: 325 G</p>
        <div className="flex gap-2 mb-4">
          <button className="border border-black text-md px-3 py-1 rounded-lg">
            325 g
          </button>
          <button className="border text-md px-3 py-1 text-gray-500 rounded-lg">
            550 g
          </button>
        </div>

        <div className="flex items-center border border-gray-300 w-28 mb-4 rounded-lg">
          <button className="w-1/3 py-1 text-lg">−</button>
          <span className="w-1/3 text-center text-sm">
            {product.quantity || 1}
          </span>
          <button className="w-1/3 py-1 text-lg">+</button>
        </div>

        <button className="flex items-center gap-2 text-sm text-black mb-2">
          <span className="text-xl">♡</span> Add to Wishlist
        </button>

        <div className="sticky bottom-0 left-0 bg-white border-t border-gray-300 pt-3 py-3">
          <div className="grid grid-cols-2 gap-2 items-center justify-center text-black">
            <span className="underline tracking-wider text-[16px] font-semibold text-center cursor-pointer transition-all duration-300 active:scale-95 ">
              View full details
            </span>
            <button className="bg-black text-white text-sm font-semibold py-2 rounded-xl transition-all duration-300 active:bg-gray-700 active:scale-95">
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// const ProductCard = ({ product, onView, onAddToCart }) => {
//   const [showCartBar, setShowCartBar] = useState(false);
//   const [showTooltip, setShowTooltip] = useState(false);

//   const handleAddToCartClick = () => {
//     onAddToCart(product);
//     setShowCartBar(true);
//   };
//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       if (i <= Math.floor(rating)) {
//         stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
//       } else if (i - rating < 1) {
//         stars.push(
//           <FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />
//         );
//       } else {
//         stars.push(<FaRegStar key={i} className="text-yellow-400 text-xs" />);
//       }
//     }
//     return stars;
//   };

//   return (
//     <div className="bg-white md:rounded-[30px] lg:rounded-[30px] p-4 lg:px-5  flex flex-col justify-between relative border hover:shadow-md transition duration-300">
//       {/* <button
//         onClick={() => onView(product)}
//         className="absolute top-3 left-3 bg-gray-50 hover:bg-gray-200 rounded-full p-2 text-gray-300"
//         title="View Product"
//       >
//         <FaRegEye />
//       </button> */}

//       <div className="flex justify-center items-center mb-2 h-[100px] lg:h-[130px]">
//         <img
//           src={product.coverimage}
//           alt={product.name}
//           className="h-[130px] lg:h-[150px] object-contain p-1"
//         />
//       </div>
//       <div className="text-left mt-3">
//         <div
//           className="relative flex"
//           onMouseEnter={() => setShowTooltip(true)}
//           onMouseLeave={() => setShowTooltip(false)}
//         >
//           <div
//             className={`absolute left-0 bottom-full mb-1 max-w-[95%] border border-dashed font-normal border-orange-200 bg-white text-orange-500 text-xs rounded-lg px-3 py-1 shadow z-30 transition-opacity duration-300 ${
//               showTooltip ? "opacity-100" : "opacity-0 pointer-events-none"
//             }
//        `}
//           >
//             {product.name}
//           </div>
//           <div>
//             <h2 className="text-[16px] font-bold text-left leading-tight tracking-wider mb-1 line-clamp-1">
//               {product.name}
//             </h2>
//           </div>
//         </div>
//         <p className="text-[12px] text-gray-600 font-medium mb-1">
//           {product.category.name}
//         </p>
//         {/* <p className="text-[12px] text-zinc-700 font-semibold italic mb-2">{product.weight}</p> */}
//       </div>

//       <div className="flex justify-between items-center gap-1 mt-1">
//         <div className="flex flex-col gap-2">
//           <div className="flex flex-row gap-1">
//             {renderStars(product.rating || 0)}
//           </div>
//           <div className="w-fit hidden">
//             <span className="flex justify-between items-center gap-1 bg-yellow-50 text-yellow-500 rounded-lg px-3 text-xs">
//               4.3
//             </span>
//           </div>
//         </div>

//         <div>
//           {product.weightVariants[0].discount > 0 && (
//             <span className="text-green-600 tracking-widest font-semibold text-[9px] md:text-[10px] px-2 py-1 rounded-full bg-green-50">
//               {product.weightVariants[0].discount + "% Off"}
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="flex flex-col items-start">
//         <div className="w-full flex items-center justify-between mt-2">
//           <div className="flex items-center gap-2">
//             {product.weightVariants[0].discount > 0 && (
//               <span className="line-through text-[12px] text-gray-400">
//                 ₹{product.weightVariants[0].price}
//               </span>
//             )}
//             <span className="text-[14px] font-bold text-black">
//               ₹
//               {pricewithDiscount(
//                 product.weightVariants[0].price,
//                 product.weightVariants[0].discount
//               )}
//             </span>
//           </div>
//           <button
//             onClick={() => handleAddToCart(product)}
//             className="border shadow-inner hover:bg-white hover:text-[#ff6a00db] bg-white font-semibold text-[10px] lg:text-sm px-2 py-1 rounded-full text-[#ff6a00db] transition duration-300 active:scale-95 flex items-center"
//           >
//             <TbShoppingBagPlus className="text-[20px] md:text-[24px]" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const ListProductCard = ({ product, onView, onAddToCart }) => {
//   const [showTooltip, setShowTooltip] = useState(false);
//   const renderStars = (rating) => {
//     const stars = [];
//     for (let i = 1; i <= 5; i++) {
//       if (i <= Math.floor(rating)) {
//         stars.push(<FaStar key={i} className="text-yellow-400 text-xs" />);
//       } else if (i - rating < 1) {
//         stars.push(
//           <FaStarHalfAlt key={i} className="text-yellow-400 text-xs" />
//         );
//       } else {
//         stars.push(<FaRegStar key={i} className="text-yellow-400 text-xs" />);
//       }
//     }
//     return stars;
//   };

//   return (
//     <div className="bg-white border shadow-sm rounded-2xl mb-3 m-0 md:m-4  md:min-h-[200px] relative  duration-200 transition-all flex">
//       {/* Product Image */}
//       <div className="justify-center w-2/5 items-center flex bg-gray-50 rounded-l-2xl">
//         <img
//           src={product.image}
//           alt={product.name}
//           className="h-32 w-32 object-cover rounded-md"
//         />
//       </div>

//       {/* Product Details */}
//       <div className="flex flex-col py-3 px-2 justify-between w-3/5 space-y-4 ">
//         <div
//           className="cursor-pointer active:scale-95"
//           onClick={() => onView(product)}
//         >
//           <div className="text-left">
//             <div
//               className="relative inline-block"
//               onMouseEnter={() => setShowTooltip(true)}
//               onMouseLeave={() => setShowTooltip(false)}
//             >
//               <div
//                 className={`absolute hidden lg:flex left-0 bottom-full mb-2 w-max max-w-xs border border-dashed border-orange-200 bg-white text-orange-500 font-normal text-xs rounded-lg px-3 py-1 shadow-sm z-50 transition-all duration-300 transform
//          ${
//            showTooltip
//              ? "opacity-100 scale-100"
//              : "opacity-0 scale-95 pointer-events-none"
//          }
//        `}
//               >
//                 {product.name}
//               </div>
//               <div className="hidden md:block">
//                 <h2 className="text-[16px] font-bold text-left leading-tight tracking-wider mb-1 line-clamp-1">
//                   {product.name}
//                 </h2>
//               </div>
//             </div>
//             <div className="overflow-hidden">
//               <h2 className="block md:hidden text-[16px] font-bold text-left leading-tight tracking-wider mb-1">
//                 {product.name}
//               </h2>
//             </div>

//             <p className="text-[12px] text-gray-600 font-medium mb-1">
//               {product.category}
//             </p>
//             {/* <p className="text-[12px] text-zinc-700 font-semibold italic mb-2">{product.weight}</p> */}
//           </div>

//           {/* Star Rating */}
//           <div className="flex gap-1 mt-1">
//             {renderStars(product.rating || 0)}
//           </div>

//           {/* Price Section */}
//           <div className="flex items-center gap-2 mt-2">
//             <span className="text-sm text-gray-400 line-through">
//               ₹{product.price}
//             </span>
//             <span className="text-base font-bold text-gray-900">
//               ₹{product.discountPrice}
//             </span>
//             {/* {product.discount && (
//               <span className="text-xs text-green-600 font-normal">
//                 ({product.discount})
//               </span>
//             )} */}
//           </div>

//           {product.discount && (
//             <span className="text-xs text-green-600 font-normal">
//               ({product.discount})
//             </span>
//           )}
//         </div>

//         {/* Add to Cart Button */}
//         <button
//           onClick={() => onAddToCart(product)}
//           className="w-full tracking-widest bg-[#F58220] text-white shadow-inner border-orange-500  px-3.5 md:px-4 py-2 rounded-full text-[11px] font-bold active:bg-orange-400 active:text-white transition flex justify-center items-center gap-1 mt-2 md:mt-0 active:scale-95"
//         >
//           Add to Cart <TbShoppingBagPlus className="text-[18px]" />
//         </button>
//       </div>
//     </div>
//   );
// };

const ProductPage = ({ category, setMobileFiltersOpen }) => {
  const ref = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cartProduct, setCartProduct] = useState(null);
  const [isListView, setIsListView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
      console.log("Fetched products:", data.data);
      dispatch(setAllProduct([...allProduct, ...data.data]));

      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log(allProduct);
  }, [allProduct]);

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
                : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 mx-1 lg:mx-5 gap-0 md:gap-4 lg:gap-4  items-start"
            }
          >
            {isLoading
              ? Array.from({ length: 6 }).map((_, idx) =>
                  isListView ? (
                    <div key={idx} className="w-full">
                      <ListLoader />
                    </div>
                  ) : (
                    <div key={idx} className="w-full sm:w-[260px]">
                      <ProductLoader />
                    </div>
                  )
                )
              : allProduct
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
                        className="rounded-xs max-w-[200px] md:min-w-[220px]"
                      />
                    )
                  )}
          </div>
        </InfiniteScroll>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

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
