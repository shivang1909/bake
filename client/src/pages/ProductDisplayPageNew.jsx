import React, { useState, useRef } from "react";
import { FaHeart, FaShoppingCart, FaStar, FaLeaf } from "react-icons/fa";
import { VscDebugBreakpointLogUnverified } from "react-icons/vsc";
import Kajukatri from "../../assets/images/Custom/Kajukatri.png";
import laddo from "../../assets/images/Custom/laddo.png";
import kajuroll from "../../assets/images/Custom/kajuroll.png";
import farsan from "../../assets/images/Custom/farsan.png";
import SampleBanner from "../../assets/images/Custom/bnnerNew.png";
import { GiDuration } from "react-icons/gi";
import { FaArrowUp, FaTruckFast } from "react-icons/fa6";
import { GiIndiaGate } from "react-icons/gi";
import OtherProducts from "../components/OtherProducts";
import ReviewDisplay from "../components/ReviewDisplay";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Axios from "../utils/Axios";
import { setIsCartOpen } from "../store/loadingSlice";

import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { useDispatch, useSelector } from "react-redux";
import { updatedShoppingCart } from "../store/userSlice";
import { useGlobalContext } from "../provider/GlobalProvider";
// import { useGlobalContext } from "../provider/GlobalProvider";
import ProductCard from "../components/ProductCard";
import AddToCartBottomBar from "../components/AddToCartBottomBar";
import shapegrey from "../../assets/images/Custom/shape-grey.png";
import Breadcrumbs from "../components/Breadcrumbs";

const ProductDisplayPageNew = () => {
  const ref = useRef(null);
  const { totalQty, setTotalQty, setIsSearchOpen } = useGlobalContext();
  useEffect(() => {
    setIsSearchOpen(false);
  }, []);
  const user = useSelector((state) => state.user);
  const cartdata = useSelector((state) => state.user.shopping_cart);
  console.log(cartdata);

  const [quantity, setQuantity] = useState(1);
  const [suggestedproduct, setsuggestproduct] = useState([]);

  const [data, setData] = useState({
    name: "",
    image: [],
    weightVariants: [],
  });
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedSize, setSelectedSize] = useState("500 gm");
  const [isAdded, setCart] = useState(false);
  const params = useParams();
  let productId = params?.product?.split("-")?.slice(-1)[0];
  // Step 1: Define thumbnail image list
  const thumbnails = [Kajukatri, laddo, kajuroll, farsan];
  const [cartProduct, setCartProduct] = useState(null);
  // Step 2: State to track selected image
  const handleCloseBottomBar = () => {
    setCartProduct(null);
  };
  const [mainImage, setMainImage] = useState(Kajukatri);

  const [zoom, setZoom] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
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

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const containerRef = useRef(null);
  const dispatch = useDispatch();
  const handleVariantChange = (index) => {
    setSelectedVariant(index);
  };
  useEffect(() => {
    console.log(user.shopping_cart);

    if (user._id != undefined) {
      console.log("inside if ");

      setCart(false);
      compareCart(selectedVariant);
    }
  }, [selectedVariant, cartdata]);

  const fetchproductbycategory = async (categoryId) => {
    console.log("Fetching products by category ID:", categoryId);
    const response = await Axios({
      ...SummaryApi.getProductByCategory,
      data: { id: categoryId, limit: 5 },
    });
    const { data: responseData } = response;
    if (responseData.success) {
      console.log(responseData);
      const filteredProducts = responseData.data.product.filter(
        (product) => product._id !== productId
      );
      setsuggestproduct(filteredProducts);
    } else {
      console.error(
        "Failed to fetch products by category:",
        responseData.message
      );
    }
  };
  const fetchProductDetails = async () => {
    try {
      console.log("Fetching product details for ID:", productId);
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        fetchproductbycategory(responseData.data.category._id);
        console.log(responseData);
        setData(responseData.data);
        setData((prev) => ({
          ...prev,
          image: [responseData.data.coverimage, ...responseData.data.image],
        }));

        // ✅ Store to localStorage for Recently Viewed
        const { _id, name, coverimage, weightVariants } = responseData.data;
        const LAST_VIEWED_KEY = "lastViewedProducts";

        const stored = localStorage.getItem(LAST_VIEWED_KEY);
        let lastViewed = stored ? JSON.parse(stored) : [];

        // Remove if already exists
        lastViewed = lastViewed.filter((p) => p._id !== _id);

        // Add to front
        lastViewed.unshift({
          _id,
          name,
          coverimage,
          price: weightVariants?.[0]?.price || 0,
        });

        // Keep max 5 items
        if (lastViewed.length > 10) {
          lastViewed = lastViewed.slice(0, 10);
        }

        localStorage.setItem(LAST_VIEWED_KEY, JSON.stringify(lastViewed));
      }
    } catch (error) {
      console.error("Error fetching product details:", error);
      AxiosToastError(error);
    }
  };
  const handleCartOpen = () => {
    console.log("Opening cart from product display page");
    dispatch(setIsCartOpen(true));
  };
  const compareCart = (index) => {
    const productIndex = cartdata.findIndex(
      (item) => item.productId === productId
    );
    if (productIndex >= 0) {
      console.log(productIndex);
      cartdata[productIndex].variants.map((variant) => {
        console.log(selectedVariant);
        if (variant.weight === index) {
          console.log(isAdded);
          setCart(true);
          return;
        }
      });
    }
  };
  useEffect(() => {
    console.log("Product ID from URL:", productId);
    fetchProductDetails();
  }, [productId]);
  const addCartItem = async () => {
    console.log("Adding item to cart");
    if (user._id === undefined) {
      AxiosToastError({
        response: {
          data: {
            message: "Please Login To Add Item in Cart", // Custom error message
          },
        },
      });
      return;
      // AxiosToastError(error)
    }
    let newVariant = {
      weight: selectedVariant, // The selected weight or variant
      cartQty: 1,
    };

    console.log(cartdata);
    // Find the product in the cart
    const productIndex = cartdata.findIndex(
      (item) => item.productId === productId
    );
    console.log(productIndex);
    let updatedCartData;

    if (productIndex === -1) {
      // Product does not exist, add it as a new entry with the selected variant
      const newProduct = {
        productId: data?._id,
        variants: [newVariant],
      };
      updatedCartData = [...cartdata, newProduct];
      setCart(true);
      console.log("new product", updatedCartData);
    } else {
      let existingProduct = { ...cartdata[productIndex] };

      existingProduct.variants = [...existingProduct.variants, newVariant];
      setCart(true);
      updatedCartData = [...cartdata];
      updatedCartData[productIndex] = existingProduct;
    }
    dispatch(updatedShoppingCart(updatedCartData));
    try {
      // Make API call to update the cart in the database
      const response = await Axios({
        ...SummaryApi.updateCartDetails,
        data: { cart: updatedCartData }, // Send the entire updated cart
      });
      setTotalQty(totalQty + 1);
      console.log("Cart updated in the database:", response.data);
    } catch (error) {
      console.error("Error updating cart in the database:", error);
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      containerRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    setLensPosition({ x, y });
  };

  return (
    <>
      <div className="mt-10 max-w-7xl mx-auto px-4 py-10 bg-white lg:mt-20">
        <div className="flex  space-y-2 mb-5">
        <Breadcrumbs/>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Images */}
          <div className="w-full lg:w-1/2 h-full [@media(min-height:1366px)]:max-h-[25vh] max-h-[75vh] lg:max-h-[60vh]">
            <div
              className="relative h-fit  w-full min-w-fit [@media(min-height:1366px)]:max-h-[25vh] lg:h-[58vh] mb-3 border rounded-2xl overflow-hidden"
              onMouseEnter={() => isLargeScreen && setZoom(true)}
              onMouseLeave={() => isLargeScreen && setZoom(false)}
              onMouseMove={handleMouseMove}
              ref={containerRef}
            >
              <img
                src={data.coverimage}
                alt="Main"
                className="w-full h-full ipadpro:h-[20vh] object-contain rounded-2xl" // match parent rounding
              />
              {/* Zoom lens */}
              {zoom && isLargeScreen && (
                <div
                  className="absolute pointer-events-none border border-gray-300 rounded-full shadow-lg overflow-hidden"
                  style={{
                    width: "250px",
                    height: "250px",
                    top: lensPosition.y - 100,
                    left: lensPosition.x - 100,
                    backgroundImage: `url(${data.coverimage})`,
                    backgroundSize: "300% 300%",
                    backgroundPosition: `${
                      (lensPosition.x / containerRef.current.offsetWidth) * 100
                    }% ${
                      (lensPosition.y / containerRef.current.offsetHeight) * 100
                    }%`,
                    zIndex: 20,
                  }}
                ></div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex space-x-8 overflow-x-auto">
              {data.image.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setData((prev) => ({ ...prev, coverimage: img }))
                  }
                  className={`border rounded-xl p-1 ${
                    mainImage === img
                      ? "border-orange-500"
                      : "border bg-gray-50"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${idx}`}
                    className="w-16 h-16 object-contain rounded-md"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:w-1/2 px-3 md:px-0">
            <div className="flex justify-between items-start">
              <div className="">
                <p className="text-sm text-white bg-orange-500 rounded-md font-bold w-fit px-2 mb-2">
                  {console.log("this", data)}
                  {data.category?.name}
                </p>
                <span className="text-3xl lg:text-4xl font-semibold text-gray-800 ">
                  {data.name}
                </span>
              </div>
              {/* <button className="text-red-500 text-xl">
              <FaHeart />
            </button> */}
              <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-md text-sm font-normal">
                <FaStar className="text-yellow-500" />
                {data.averageRating?.toFixed(1) || 4}
              </div>
            </div>

            <div className="mt-4 max-w-md">
              <p className="font-medium  text-gray-700 tracking-wider ">
                {data.description}
              </p>
            </div>

            {/* Price and Rating */}
            <div className="flex items-center gap-4 mt-5">
              <p className="text-2xl font-bold text-gray-800">
                Rs.
                {DisplayPriceInRupees(
                  pricewithDiscount(
                    data.weightVariants[selectedVariant]?.price || 0,
                    data.weightVariants[selectedVariant]?.discount
                  )
                )}
              </p>
              <span className="text-sm text-green-600 font-medium">
                {data.weightVariants[selectedVariant]?.discount}% Off
              </span>
            </div>

            {/* Size Options */}
            <div className="mt-5">
              <p className="font-medium text-gray-700 mb-2">
                Available Varients
              </p>
              <div className="flex flex-row overflow-x-auto whitespace-nowrap gap-2 font-normal">
                {data.weightVariants?.map((variant, index) => (
                  <button
                    key={variant._id}
                    className={`px-4 py-2 border border-gray-400 border-dotted rounded-[35px] ${
                      selectedVariant === index
                        ? "bg-orange-500 text-white rounded-[50px]"
                        : "bg-white rounded-[35px]"
                    }`}
                    onClick={() => handleVariantChange(index)}
                  >
                    {variant.weight}
                  </button>
                ))}
              </div>
            </div>

            <div className="block md:hidden mt-10 max-w-md">
              {/* <div className="flex gap-3 justify-between ">
                <div className="flex flex-col space-y-2 justify-center items-center whitespace-nowrap">
                  <div className="text-orange-600 text-4xl bg-gray-100 px-2 py-2 rounded-full w-fit">
                    <GiDuration />
                  </div>
                  <span className="text-xs font-semibold text-center ">
                    {data.shelf_life} Days Of
                    <br /> Shelf Life
                  </span>
                </div>
                <div className="flex flex-col space-y-2 justify-center items-center whitespace-nowrap">
                  <div className="text-orange-600 text-4xl bg-gray-100 px-2 py-2 rounded-full w-fit">
                    <FaTruckFast />
                  </div>
                  <span className="text-xs font-semibold text-center">
                    Delivery Within <br /> 3-5 Days
                  </span>
                </div>
                <div className="flex flex-col space-y-2 justify-center items-center whitespace-nowrap">
                  <div className="text-orange-600 text-4xl bg-gray-100 px-2 py-2 rounded-full w-fit">
                    <FaLeaf />
                  </div>
                  <span className="text-xs font-semibold text-center">
                    No Preservatives
                  </span>
                </div>
              </div> */}

              {/* <div className="samplebanner mt-4">
                <img
                  src={SampleBanner}
                  alt=""
                  className="rounded-xl block md:hidden"
                />
              </div> */}

              {/* <ul className="mt-4 grid grid-cols-2 w-full list-disc list-inside text-gray-800 font-semibold space-y-2">
              <li className="flex gap-2 items-center">
                <VscDebugBreakpointLogUnverified /> Made with premium cashews
              </li>
              <li className="flex gap-2 items-center">
                <VscDebugBreakpointLogUnverified /> Smooth and melt-in-the-mouth
              </li>
              <li className="flex gap-2 items-center">
                <VscDebugBreakpointLogUnverified /> No added preservatives
              </li>
              <li className="flex gap-2 items-center">
                <VscDebugBreakpointLogUnverified /> Decorated with edible silver
                leaf
              </li>
              <li className="flex gap-2 items-center">
                <VscDebugBreakpointLogUnverified /> Perfect for festive gifting
              </li>
            </ul> */}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 font-normal">
              {/* <div className="flex items-center justify-between font-bold border rounded-full w-full md:w-fit px-3 py-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-xl px-6"
                >
                  −
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-xl px-6"
                >
                  +
                </button>
              </div> */}

              {data.weightVariants[selectedVariant] &&
              data.weightVariants[selectedVariant].qty > 0 ? (
                <>
                  {isAdded ? (
                    // <DisplayCartItem  />
                    <button
                      className="flex items-center justify-center font-semibold gap-2 px-10 py-3 border bg-orange-500 text-white rounded-full w-full  transition-all duration-200 active:scale-95"
                      onClick={handleCartOpen}
                    >
                      <FaShoppingCart className="text-lg" />
                      Go To Cart
                    </button>
                  ) : (
                    <button
                      onClick={addCartItem}
                      className="flex items-center justify-center font-semibold gap-2 px-10 py-3 bg-orange-500 text-white rounded-full w-full  transition-all duration-200 active:scale-95"
                    >
                      <FaShoppingCart className="text-lg" />
                      Add To Cart{" "}
                    </button>
                  )}
                </>
              ) : (
                <p className="text-lg text-red-500 my-2">
                  Sorry We're Out of Stock right now for {data.name} !
                </p>
              )}
            </div>

            {/* Quantity & Actions */}
          </div>
        </div>
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
              {data.shelf_life} Days Of
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

      <div className="lg:mt-28 mt-8 ml-5 md:mx-10 lg:mx-20 xl:mx-32 2xl:mx-40 bg-gray-50 rounded-l-[20px] lg:rounded-[20px] shadow-sm">
        <div className="flex justify-between items-center pl-5  lg:pl-7 pt-4 mb-2">
          <span className="text-lg lg:text-2xl font-semibold">
            We Think You'll Like These Too!
          </span>
          {/* <button className="text-xs flex items-center gap-1 bg-orange-400 text-white pl-3 pr-2 py-2 rounded-l-full  font-semibold">
        View All <FaAngleDoubleRight />
      </button> */}
        </div>
        <div className="flex gap-4 p-3 pb-4 px-4 lg:px-6 overflow-x-auto scrollbar-thumb-gray-300 scrollbar-thin">
          {suggestedproduct.map((product, index) => (
            <ProductCard
              product={product}
              setCartProduct={setCartProduct}
              className="rounded-[15px] min-w-[200px] max-w-[200px] md:min-w-[220px]"
            />
          ))}
        </div>
      </div>

      <div className="lg:mx-20">
        <ReviewDisplay productId={productId} />
      </div>
       <button
                onClick={scrollToTop}
                className={`fixed bottom-5 right-5 z-40 w-12 h-12 rounded-full bg-slate-950/80 backdrop-blur-lg text-white p-3 shadow-lg transition-all duration-300 hover:bg-slate-800 hover:scale-110 active:scale-90 ${
                  showScrollTop ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                <FaArrowUp className="w-full h-full" />
              </button>
      {cartProduct && (
        <AddToCartBottomBar
          reference={ref}
          product={cartProduct}
          onClose={handleCloseBottomBar}
          activeIndex={0}
        />
      )}
    </>
  );
};

export default ProductDisplayPageNew;
