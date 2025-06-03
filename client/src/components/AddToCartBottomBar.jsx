import React, { useState, useEffect } from "react";
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



const AddToCartBottomBar = ({ product, onClose }) => {
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [qty, setQty] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const { totalQty, setTotalQty } = useGlobalContext();
  const cartdata = useSelector((state) => state.user.shopping_cart);
  const loadingValue = useSelector((state) => state.loading.loadingValue);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [isAdded, setCart] = useState(false);

  const addCartItem = async () => {
    console.log("this is cart");
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
          <img
            src={product.coverimage}
            alt={product.name}
            className="w-fit h-40 object-cover rounded-xl mb-2"
          />
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
                onClick={() => setSelectedVariant(index)}
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
        <div className="flex justify-center items-center text-center gap-2 mt-4">
           {product.weightVariants[selectedVariant].discount > 0 ? (
              <span className="text-xs font-semibold text-green-600">
                {product.weightVariants[selectedVariant].discount}% Off
              </span>
            ):(
              <span className="text-xs font-semibold text-yellow-600 flex items-center gap-1">
               <AiFillInfoCircle/> Select Bigger Size for Discount
              </span>
            )}
        </div>
  
        <div className="flex justify-center items-center text-center gap-2 mt-2">
          {product.weightVariants[selectedVariant].discount > 0 && (
            <span className="text-md text-gray-400 line-through">
              ₹{product.weightVariants[selectedVariant].price}
            </span>
          )}
          <span className="flex text-lg font-bold text-gray-900 justify-center">
            ₹
            {pricewithDiscount(
              product.weightVariants[selectedVariant].price,
              product.weightVariants[selectedVariant].discount
            )}
           
          </span>
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
            <button
              className="flex-1 bg-orange-500 text-white font-bold py-4 tracking-wider px-5 rounded-full shadow-md  transition active:scale-95"
              onClick={addCartItem}
            >
              Add{" "}
              {selectedVariant
                ? `(${product.weightVariants[selectedVariant].weight})`
                : ""}{" "}
              to Cart
            </button>
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
