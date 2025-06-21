import React, { useState, useEffect,useRef  } from "react";
import { IoMdCloseCircle } from "react-icons/io";
import { motion } from "framer-motion";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { useDispatch, useSelector } from "react-redux";
import { updatedShoppingCart } from "../store/userSlice";
import SummaryApi from "../common/SummaryApi";
import { setIsCartOpen } from "../store/loadingSlice";
import { useGlobalContext } from "../provider/GlobalProvider";
import Axios from "../utils/Axios";
import { AiFillInfoCircle } from "react-icons/ai";
import { PiWarningCircleLight } from "react-icons/pi";
import toast from "react-hot-toast";
import { BiLogInCircle } from "react-icons/bi";


const AddToCartBottomBar = ({ product, onClose , activeIndex = 0 }) => {
  const errorToastId = useRef(null);
  const [selectedVariant, setSelectedVariant] = useState(activeIndex);
  const [qty, setQty] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const { totalQty, setTotalQty } = useGlobalContext();
  const cartdata = useSelector((state) => state.user.shopping_cart);
  const loadingValue = useSelector((state) => state.loading.loadingValue);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isAdded, setCart] = useState(false);

  useEffect(() => {
     if (open) {
       document.body.style.overflow = "hidden";
     } else {
       document.body.style.overflow = "auto";
     }
   }, [open]);
  const addCartItem = async () => {
    if (user._id === undefined) {
      // If toast is already active, dismiss it
      if (errorToastId.current) {
        toast.dismiss(errorToastId.current);
      }

      // Show new error and store its ID
      errorToastId.current = toast.error(
       <>
        <div className="flex items-center gap-2">
    <BiLogInCircle className="text-yellow-500 text-3xl -ml-4" />
    <span className="font-semibold whitespace-nowrap">
      Please login to add items to the cart
    </span>
  </div>
         
          </>,
        {
          icon: '', // disable default icon
          style: {
            paddingLeft: 0, // 👈 remove that left spacing
          },
        }
      );
      
      return;
    }

    let newVariant = {
      weight: selectedVariant, // The selected weight or variant
      cartQty: qty,
    };

    console.log(cartdata);
    // Find the product in the cart
    const productIndex = cartdata.findIndex(
      (item) => item.productId === product._id
    );
    console.log(productIndex);
    let updatedCartData;

    if (productIndex === -1) {
      // Product does not exist, add it as a new entry with the selected variant
      const newProduct = {
        productId: product._id,
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
      setTotalQty(totalQty + qty);
      console.log("Cart updated in the database:", response.data);
    } catch (error) {
      console.error("Error updating cart in the database:", error);
    }
  };

  const compareCart = (index) => {
    console.log("this is data", cartdata);
    const productIndex = cartdata.findIndex(
      (item) => item.productId === product._id
    );
    if (productIndex >= 0) {
      console.log(productIndex);
      cartdata[productIndex].variants.map((variant) => {
        console.log(selectedVariant);
        if (variant.weight === index) {
          setCart(true);
          return;
        }
      });
    }
  };

  useEffect(() => {
    console.log(user.shopping_cart);
    console.log(selectedVariant)

    if (user._id != undefined) {
      console.log("inside if ");

      setCart(false);
      compareCart(selectedVariant);
    }
  }, [loadingValue, selectedVariant, cartdata]);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const handleDecrease = () => {
    if (qty > 1) setQty(qty - 1);
  };

  const handleIncrease = () => {
    setQty(qty + 1);
  };

  const handleCartOpen = () => {
    dispatch(setIsCartOpen(true));
    handleClose();
  };

  return (
    <>
      {console.log(product)}
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 bg-zinc-800/60 z-40 transition-opacity duration-300
          ${
            isVisible
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
        onClick={handleClose}
      />

      {/* Bottom Sheet */}
      <div
        className={`
    fixed z-50
    bg-white px-6 pt-3 pb-6 rounded-t-3xl shadow-2xl
    transition-transform duration-300 ease-in-out
    ${isVisible ? "translate-y-0" : "translate-y-full"}

    bottom-0 left-0 right-0
    md:bottom-8 md:right-8 md:left-auto md:w-[380px] md:rounded-3xl
  `}
      >
        {/* Dragger */}
        <div className="w-full flex justify-center mb-2">
          <div className="w-12 h-1.5 bg-gray-400 rounded-full" />
        </div>

        {/* Product Image */}
        <div className="flex justify-center">
          <div className="relative w-fit h-40 flex justify-center">
          <img
            src={product.coverimage}
            alt={product.name}
            className={`w-full h-full object-cover rounded-xl transition-all duration-300 ease-in-out 
      ${
        product.weightVariants[selectedVariant].qty < qty
          ? "blur-[2px] brightness-50"
          : ""
      }
    `}
          />
          {product.weightVariants[selectedVariant].qty < qty && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xl font-bold">Out of Stock</span>
            </div>
          )}
        </div>
        </div>
        

        {/* Product Name */}
        <div className="overflow-hidden">
          <h2 className="text-xl font-semibold text-center text-gray-900">
            {product.name}
          </h2>
        </div>

        {/* Variant Toggles */}
        {product.weightVariants && (
          <div className="flex flex-wrap font-normal justify-center gap-2 ">
            {product.weightVariants.map((variant, index) => (
              <button
                key={index}
                onClick={() => {setSelectedVariant(index),
                  setQty(1)
                }
                }
                className={`px-4 py-1.5 font-semibold text-sm rounded-full border transition-all
                  ${
                    selectedVariant === index
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-orange-500 hover:text-orange-500"
                  }
                `}
              >
                {variant.weight}
              </button>
            ))}
          </div>
        )}

        <div className="hidden md:block flex justify-center items-center text-center gap-2 mt-4">
          {product.weightVariants[selectedVariant].discount > 0 && (
            <span className="text-xs font-semibold text-green-600">
              {product.weightVariants[selectedVariant].discount}% Off
            </span>
          ) }
        </div>

        <div className="flex justify-center items-center text-center gap-2 mt-5 md:mt-2">
          {product.weightVariants[selectedVariant].discount > 0 && (
            <span className="text-md text-gray-400 line-through">
              ₹{product.weightVariants[selectedVariant].price}
            </span>
          )}
          <span className="flex text-lg font-bold text-gray-900  justify-center items-center">
            ₹
            {pricewithDiscount(
              product.weightVariants[selectedVariant].price,
              product.weightVariants[selectedVariant].discount
            )}
          </span>
          <div className="block md:hidden">
            {product.weightVariants[selectedVariant].discount > 0 && (
              <span className="text-xs font-semibold text-green-600">
                ( {product.weightVariants[selectedVariant].discount}% Off )
              </span>
            ) 
            }
          </div>
        </div>

        {/* out of stock if stock is not available  */}
        {/* <p className="text-sm text-red-500 font-normal text-center mt-1">
          {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
        </p> */}

        {/* Add to Cart Button */}
        <div className="mt-2 w-full flex items-center gap-3 py-4">
          {/* Quantity Selector */}
          {!isAdded && (
            <div className="flex items-center font-normal border rounded-full px-3 py-3 shadow-sm">
              <button
                onClick={handleDecrease}
                className="text-xl font-bold text-gray-700 px-2"
              >
                -
              </button>
              <span className="px-2 w-6 text-center">{qty}</span>
              <button
                onClick={handleIncrease}
                className="text-xl font-bold text-gray-700 px-2"
              >
                +
              </button>
            </div>
          )}
          {console.log(isAdded)}
          {/* Add to Cart Button */}
          {!isAdded ? (
            <>
              {product.weightVariants[selectedVariant].qty < qty ? (
                <div className="flex gap-2 text-xs justify-center items-center bg-white border border-red-500 text-red-500 font-bold py-4 tracking-wider px-5 rounded-full shadow-md transition active:scale-95 cursor-not-allowed">
                  <PiWarningCircleLight className="text-lg" /> We're Out Of
                  Stock
                </div>
              ) : (
                <button
                  className="flex-1 bg-orange-500 text-white font-bold py-4 tracking-wider px-5 rounded-full shadow-md transition active:scale-95"
                  onClick={addCartItem}
                >
                  Add
                  to Cart
                </button>
              )}
            </>
          ) : (
            <button
              className="flex-1 bg-orange-500 text-white font-bold py-4 tracking-wider px-5 rounded-full shadow-md  transition active:scale-95"
              onClick={handleCartOpen}
            >
              Go to Cart
            </button>
          )}
        </div>
      </div>

      {/* Floating Close Button */}
      {/* <button
        onClick={handleClose}
        className="fixed bottom-[calc(300px+2rem)] left-1/2 transform -translate-x-1/2 z-50 text-white text-3xl"
      >
        <IoMdCloseCircle className="drop-shadow-lg text-gray-700 hover:text-red-500" />
      </button> */}
    </>
  );
};

export default AddToCartBottomBar;
