import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { FaCaretRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";


import { pricewithDiscount } from "../utils/PriceWithDiscount";
import imageEmpty from "../assets/empty_cart.webp";
import toast from "react-hot-toast";
import { updatedShoppingCart } from "../store/userSlice";
import { useEffect } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { FaMinus, FaPlus } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { valideURLConvert } from "../utils/valideURLConvert";




const DisplayCartItem = ({ close, open }) => {
  const dispatch = useDispatch();
  const {
    cartItems,
    setCartItem,
    totalPrice,
    totalQty,
    notDiscountTotalPrice,
    setTotalPrice,
    setTotalQty,
    setNotDiscountTotalPrice,
  } = useGlobalContext();
  const cartdata = useSelector((state) => state.user.shopping_cart);


  const user = useSelector((state) => state.user);


  // console.log();


  const isCartOpen = useSelector((state) => state?.loading.isCartOpen);


  const [recentlyViewed, setRecentlyViewed] = useState([]);






  useEffect(() => {
    setActiveTab("cart")
    const stored = localStorage.getItem("lastViewedProducts");
    if (stored) {
      setRecentlyViewed(JSON.parse(stored));
    } else {
      setRecentlyViewed([]);
    }
    if (isCartOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "auto"; // Enable scrolling
    }
  }, [isCartOpen]);


  const handleclose = () => {
    close();
  };


  const [activeTab, setActiveTab] = useState("cart");
  const [selectedTab, setSelectedTab] = useState(0);


  const decreaseQty =async (qty, productIndex, variantIndex) => {
    let updatedData;
    if (
      qty === 1 &&
      cartdata[productIndex].variants.length === 1 &&
      cartdata.length === 1
    ) {
      updatedData = [];
      dispatch(updatedShoppingCart([])); // Make sure you have this action
      setCartItem([]);
    } else if (qty === 1 && cartdata[productIndex].variants.length === 1) {
      updatedData = cartdata.filter((_, index) => index !== productIndex);


      dispatch(updatedShoppingCart(updatedData)); // Make sure you have this action


      // Update cartItems
      setCartItem((prevCartItems) => {
        const updatedCartItems = prevCartItems.filter(
          (_, index) => index !== productIndex
        );
        return updatedCartItems;
      });
    } else if (qty === 1) {
      updatedData = cartdata.map((product) => ({
        ...product,
        variants: [...product.variants],
      }));


      updatedData[productIndex].variants.splice(variantIndex, 1);
      dispatch(updatedShoppingCart(updatedData));
      setCartItem((prevCartItems) => {
        const updatedCartItems = prevCartItems.map((item) => ({
          ...item,
          variantPrices: [...item.variantPrices],
        }));
        updatedCartItems[productIndex].variantPrices.splice(variantIndex, 1);


        return updatedCartItems;
      });
    } else {
      // Step 1: Create a deep copy of the cart data
      updatedData = cartdata.map((product) => ({
        ...product,
        variants: product.variants.map((variant) => ({ ...variant })), // Ensure deep copy of variants
      }));


      // Step 2: Decrease the quantity
      updatedData[productIndex].variants[variantIndex].cartQty = qty - 1;


      // Step 3: Dispatch the updated cart data
      dispatch(updatedShoppingCart(updatedData));


      // Step 4: Update local cart items if managed separately
      setCartItem((prevCartItems) => {
        const updatedCartItems = prevCartItems.map((item) => ({
          ...item,
          variantPrices: [...item.variantPrices],
        }));


        updatedCartItems[productIndex].variantPrices[variantIndex].quantity =
          qty - 1;


        return updatedCartItems;
      });
    }
    //Quantity
    let newTotalQty = totalQty - 1;
    setTotalQty(newTotalQty);
    //Discounted Price
    let newTotalPrice =
      totalPrice - cartItems[productIndex].variantPrices[variantIndex].price;
    let eachDiscount =
      cartItems[productIndex].variantPrices[variantIndex].price *
      (cartItems[productIndex].variantPrices[variantIndex].discount / 100);
    setTotalPrice(newTotalPrice + eachDiscount);
    //Not  Discounted Price
    setNotDiscountTotalPrice(
      notDiscountTotalPrice -
        cartItems[productIndex].variantPrices[variantIndex].price
    );
    await updateQuantity(updatedData);
  };


  const increaseQty = async (qty, productIndex, variantIndex) => {
    // Step 1: Create a deep copy of the cart data
    let updatedData = cartdata.map((product) => ({
      ...product,
      variants: product.variants.map((variant) => ({ ...variant })), // Ensure deep copy of variants
    }));


    // Step 2: Update the cart quantity for the specific product and variant
    updatedData[productIndex].variants[variantIndex].cartQty = qty + 1;


    // Step 3: Dispatch the updated cart data to the state
    dispatch(updatedShoppingCart(updatedData));


    // Step 4: Optionally update local cart items if managed separately
    setCartItem((prevCartItems) => {
      const updatedCartItems = prevCartItems.map((item) => ({
        ...item,
        variantPrices: [...item.variantPrices],
      }));


      // Update the cart quantity in the local state
      updatedCartItems[productIndex].variantPrices[variantIndex].quantity =
        qty + 1;
      return updatedCartItems;
    });
    let newTotalQty = totalQty + 1;
    setTotalQty(newTotalQty);
    let newTotalPrice =
      totalPrice + cartItems[productIndex].variantPrices[variantIndex].price;
    let eachDiscount =
      cartItems[productIndex].variantPrices[variantIndex].price *
      (cartItems[productIndex].variantPrices[variantIndex].discount / 100);
    setTotalPrice(newTotalPrice - eachDiscount);
    setNotDiscountTotalPrice(
      notDiscountTotalPrice +
        cartItems[productIndex].variantPrices[variantIndex].price
    );
    await updateQuantity(updatedData);
  };


      const updateQuantity = async (updatedData) => {
      try {




        // Make API call to update the cart in the database
        const response = await Axios({
          ...SummaryApi.updateCartDetails,
          data: { cart: updatedData }, // Send the entire updated cart
        });
        console.log("Cart updated in the database:", response.data);
      } catch (error) {
     
      }
    };


  // useEffect(() => {
  //   if (isCartOpen) {
  //     document.body.style.overflow = "hidden"; // Disable scrolling
  //   } else {
  //     document.body.style.overflow = "auto"; // Enable scrolling
  //   }
  // }, [isCartOpen]);


  const navigate = useNavigate();
  const redirectToCheckoutPage = () => {
    if (user?._id) {
   
      navigate("/dashboard/checkout", { state: { fromCart: true } });


      if (close) {
        close();
      }
      return;
    }
    toast("Please Login");
  };
  return (
    <>
      <div
        className={`
        fixed inset-0 bg-zinc-800/60 z-50 transition-opacity duration-300
        ${
          isCartOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }
      `}
        onClick={handleclose}
      />


      <div
        className={`
        bg-white w-full  max-w-md h-screen ml-auto fixed top-0 bottom-0 right-0 left-0 z-50 transition-transform duration-300 ease-in-out
        ${isCartOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        {/* Top bar */}
        <div className="flex items-center p-4 gap-3 justify-between">
          <span className="font-bold text-xl text-center">My Cart</span>
          <button onClick={close}>
            <IoClose size={25} />
          </button>
        </div>


        {/* Toggle buttons */}
        <div className="relative flex justify-between items-center w-full max-w-md mx-auto bg-white p-2 rounded-[25px] shadow-md ">
          <span
            className="absolute top-2 left-2 h-[48px] w-[calc(50%-0.5rem)] rounded-full z-0 transition-transform duration-300"
            style={{
              transform:
                activeTab === "cart" ? "translateX(0)" : "translateX(100%)",
              backgroundColor: activeTab === "cart" ? "#d1f3f5" : "#ffe8d0",
            }}
          />
          <button
            onClick={() => setActiveTab("cart")}
            className={`z-10 flex justify-center items-center w-1/2 py-3 text-2xl font-semibold transition-colors rounded-full ${
              activeTab === "cart" ? "text-[#008E97]" : "text-black"
            }`}
          >
            <FaCartShopping />
          </button>


          <button
            onClick={() => setActiveTab("recent")}
            className={`z-10 flex justify-center items-center w-1/2 py-3 text-2xl font-semibold transition-colors rounded-full ${
              activeTab === "recent" ? "text-orange-500" : "text-black"
            }`}
          >
            <FaEye />
          </button>
        </div>


        {/* Cart Content */}
        {activeTab === "cart" ? (
          <div className="flex flex-col h-[calc(100vh-190px)] md:h-[calc(100vh-120px)]">
            {/* HEADER */}


            {/* BODY - SCROLLABLE */}


            <div className="flex-1 overflow-auto px-2 space-y-4">
              {Array.isArray(cartItems) && cartItems.length > 0 ? (
                cartItems.map((item, productIndex) =>
                  item.variantPrices.map((variant, index) => (
                    <div
                      key={`${item.productId}_product_${index}`}
                      className="flex flex-col w-full border-b p-4"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-16 h-16 bg-orange-50 rounded">
                          <img
                            src={item.coverimage}
                            alt={item.name}
                            className="w-full h-full object-scale-down"
                          />
                        </div>
                        <div className="w-full">
                          <p className="text-sm font-semibold">
                            {item.itemname}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <div>
                              <p className="text-xs font-normal text-neutral-400">
                                {variant.weight}
                              </p>
                              <p className="font-semibold">
                                {DisplayPriceInRupees(
                                  pricewithDiscount(
                                    variant.price,
                                    variant.discount
                                  ) * variant.quantity
                                )}
                              </p>
                            </div>


                            <div className="flex h-full">
                              <button
                                onClick={() =>
                                  decreaseQty(
                                    variant.quantity,
                                    productIndex,
                                    index
                                  )
                                }
                                className="bg-orange-400 hover:bg-orange-400 text-white px-3 py-1 rounded-full flex items-center justify-center"
                              >
                                <FaMinus />
                              </button>
                              <p className="font-semibold px-4 flex items-center justify-center">
                                <span>{variant.quantity}</span>
                              </p>
                              <button
                                onClick={() =>
                                  increaseQty(
                                    variant.quantity,
                                    productIndex,
                                    index
                                  )
                                }
                                className="bg-orange-400 hover:bg-orange-400 text-white px-3 py-1 rounded-full flex items-center justify-center"
                              >
                                <FaPlus />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )
              ) : (
                <div className="flex flex-col justify-center items-center mt-20">
                 <DotLottieReact
      src="https://lottie.host/ac492bf8-6965-427b-9140-0c3af6233a30/g6j2FqfGL8.lottie"
      loop
      autoplay
    />
                  <Link
                    onClick={close}
                    to="/shopall"
                    className="block mt-4 font-semibold text-md bg-orange-500 px-4 py-2 text-white rounded-full transition-all duration-300  active:scale-95 cursor-pointer"
                  >
                    Shop Now
                  </Link>
                </div>
              )}
            </div>


            {/* FOOTER - STICKY */}
            {cartItems.length > 0 && (
              <div
                style={{ boxShadow: "0 -4px 8px rgba(0, 0, 0, 0.1)" }}
                className={`bg-white p-4 border-t font-normal text-black rounded-[35px]  flex flex-col `}
              >
                <h3 className="font-semibold text-lg text-center mb-3">
                  Bill Details
                </h3>


                <div className="space-y-2">
                  <div className="flex gap-4 justify-between ml-1">
                    <p>Items total</p>
                    <p className="flex items-center gap-2">
                      <span className="line-through text-neutral-400">
                        {DisplayPriceInRupees(notDiscountTotalPrice)}
                      </span>
                      <span>{DisplayPriceInRupees(totalPrice)}</span>
                    </p>
                  </div>


                  <div className="flex gap-4 justify-between ml-1">
                    <p>Quantity total</p>
                    <p>{totalQty} items</p>
                  </div>


                  <div className="flex gap-4 justify-between ml-1">
                    <p>Delivery Charge</p>
                    <p>Free</p>
                  </div>


                  <div className="my-4">
                    <div className="flex items-center justify-between  py-1  font-semibold text-green-700 px-1">
                      <p>Your total savings</p>
                      <p>
                        {DisplayPriceInRupees(
                          notDiscountTotalPrice - totalPrice
                        )}
                      </p>
                    </div>
                  </div>


                  <div className="font-semibold text-[#008E97] flex items-center justify-between gap-4 ml-1">
                    <p>Grand total</p>
                    <p>{DisplayPriceInRupees(totalPrice)}</p>
                  </div>
                </div>


                <div className=" pt-3 bg-white ">
                  <div
                    onClick={redirectToCheckoutPage}
                    className="bg-red-600  text-neutral-100 px-4 font-bold text-base py-3 rounded-full flex items-center justify-between transition-all duration-300 active:scale-95 cursor-pointer"
                  >
                    <div>{DisplayPriceInRupees(totalPrice)}</div>
                    <button
                      onClick={redirectToCheckoutPage}
                      className="flex items-center gap-1"
                    >
                      Proceed
                      <span>
                        <FaCaretRight />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 flex flex-col overflow-y-auto">
            <p className="font-semibold text-lg mb-4">Recently Viewed</p>
            <div className="divide-y divide-gray-200">
              {recentlyViewed.map((item,index) => (
                <Link key={index} to={`/product/${valideURLConvert(item.name)}-${item._id}`}
                onClick={close}
                >
                <div key={item._id} className="flex gap-4 py-4 items-center">
                  <img
                    src={item.coverimage}
                    alt={item.name}
                    className="h-24 w-24 object-cover rounded border"
                  />
                  <div className="flex-1">
                    <h3 className="text-md font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">₹{item.price}</p>
                  </div>
                </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};


export default DisplayCartItem;
