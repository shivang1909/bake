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
import { FaMinus, FaPlus } from "react-icons/fa6";

const DisplayCartItem = ({ close }) => {
  const [cartItems, setCartItem] = useState([]);
  const dispatch = useDispatch();

  const [totalPrice, setTotalPrice] = useState(0);
  const [notDiscountTotalPrice, setNotDiscountTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const cartdata = useSelector((state) => state.user.shopping_cart);
  const user = useSelector((state) => state.user);
  console.log(user);
  // console.log();
  const decreaseQty = (qty, productIndex, variantIndex) => {
 
      let updatedData;
      if (qty === 1 && cartdata[productIndex].variants.length === 1 && cartdata.length === 1) {
        dispatch(updatedShoppingCart([])); // Make sure you have this action
        setCartItem([])
      }
      else if (qty === 1 && cartdata[productIndex].variants.length === 1) {
        updatedData = cartdata.filter((_, index) => index !== productIndex);

        dispatch(updatedShoppingCart(updatedData)); // Make sure you have this action

        // Update cartItems
        setCartItem((prevCartItems) => {
          const updatedCartItems = prevCartItems.filter((_, index) => index !== productIndex);
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
      }
      else{
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

      updatedCartItems[productIndex].variantPrices[variantIndex].quantity = qty - 1;
      
      return updatedCartItems;
    });
    
  }
  //Quantity
  let newTotalQty = totalQty - 1;
  setTotalQty(newTotalQty)
  //Discounted Price
  let newTotalPrice = totalPrice - (cartItems[productIndex].variantPrices[variantIndex].price)
  let eachDiscount= (cartItems[productIndex].variantPrices[variantIndex].price ) * (cartItems[productIndex].variantPrices[variantIndex].discount / 100)
    setTotalPrice(newTotalPrice + eachDiscount) 
    //Not  Discounted Price
    setNotDiscountTotalPrice(notDiscountTotalPrice-cartItems[productIndex].variantPrices[variantIndex].price)
  };

  const increaseQty = (qty, productIndex, variantIndex) => {
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
      updatedCartItems[productIndex].variantPrices[variantIndex].quantity = qty + 1;  
      return updatedCartItems;
    });
    let newTotalQty = totalQty + 1;
    setTotalQty(newTotalQty)
    let newTotalPrice = totalPrice + (cartItems[productIndex].variantPrices[variantIndex].price)
    let eachDiscount= (cartItems[productIndex].variantPrices[variantIndex].price ) * (cartItems[productIndex].variantPrices[variantIndex].discount / 100)
    setTotalPrice(newTotalPrice - eachDiscount) 
    setNotDiscountTotalPrice(notDiscountTotalPrice+cartItems[productIndex].variantPrices[variantIndex].price)
  };

  useEffect(()=>{
    const updateQuantity = async () => {
      try {
      console.log(cartdata);
      console.log(cartItems);
      
      // Make API call to update the cart in the database
      const response = await Axios({
        ...SummaryApi.updateCartDetails,
        data: { cart: cartdata }, // Send the entire updated cart
      });
      console.log("Cart updated in the database:", response.data);
    } catch (error) {
      console.error("Error updating cart in the database:", error);
    }
  }
  updateQuantity();
  },[cartdata])


  const calculateTotalPriceandQty= (responseData) =>{
    let finalTotal = 0;
    let quantity = 0;
    let discountedPrice=0;
    for (let i = 0; i < responseData.data.length; i++) {
      let eachDiscount =0;
      for (let j = 0;j < responseData.data[i].variantPrices.length;j++) {
        finalTotal = finalTotal + (responseData.data[i].variantPrices[j].price * responseData.data[i].variantPrices[j].quantity);
        quantity = quantity + responseData.data[i].variantPrices[j].quantity;
        eachDiscount= (responseData.data[i].variantPrices[j].price * responseData.data[i].variantPrices[j].quantity) * (responseData.data[i].variantPrices[j].discount / 100)
        console.log(eachDiscount);
        
        discountedPrice = discountedPrice + eachDiscount        
      }
    }
    setNotDiscountTotalPrice(finalTotal);
    setTotalQty(quantity);
    // console.log(discountedPrice);

    setTotalPrice(finalTotal- discountedPrice);
  } 
  // Fetch Cart Details
  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.usercartdetails,
        });
        const { data: responseData } = response;
        if (responseData.success) {

          setCartItem(responseData.data);
          calculateTotalPriceandQty(responseData);
        }
      } catch (error) {
        console.error("Error fetching cart details:", error);
      }
    };
    fetchCartDetails();
  }, []);

  const navigate = useNavigate();

  const redirectToCheckoutPage = () => {
    if (user?._id) {
      navigate("/dashboard/checkout");
      if (close) {
        close();
      }
      return;
    }
    toast("Please Login");
  };
  return (
    <section className="bg-neutral-900 fixed top-0 bottom-0 right-0 left-0 bg-opacity-70 z-50">
      <div className="bg-white w-full max-w-sm min-h-screen max-h-screen ml-auto">
        <div className="flex items-center p-4 shadow-md gap-3 justify-between">
          <h2 className="font-semibold">Cart</h2>
          <Link to={"/"} className="lg:hidden">
            <IoClose size={25} />
          </Link>
          <button onClick={close} className="hidden lg:block">
            <IoClose size={25} />
          </button>
        </div>

        <div className="min-h-[75vh] lg:min-h-[80vh] h-full max-h-[calc(100vh-150px)] bg-blue-50 p-2 flex flex-col gap-4">
          {cartItems.length > 0 ? (
            <>
              <div className="flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full">
                <p>Your total savings</p>
                <p>
                  {DisplayPriceInRupees(notDiscountTotalPrice - totalPrice)}
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 grid gap-5 overflow-auto">
                {cartItems.map((item, productIndex) =>
                  item.variantPrices.map((variant, index) => (
                    <div
                    key={`${item.productId}_product_${index}`}
                      className="flex flex-col w-full gap-4 border-b pb-4"
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-16 h-16 bg-red-500 border rounded">
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
                          <div
                            key={`${item.productId}_variant_${index}`}
                            className="flex justify-between items-center mt-2"
                          >
                            <div>
                              <p className="text-xs text-neutral-400">
                                Weight: {variant.weight}
                              </p>
                              <p className="font-semibold">
                                {DisplayPriceInRupees(
                                  pricewithDiscount(
                                    variant.price,
                                    variant.discount 
                                  )*variant.quantity
                                )}
                              </p>
                            </div>
                            <div className="w-full max-w-[150px]">
                              <div className="flex w-full h-full">
                                <button
                                  onClick={() =>
                                    decreaseQty(
                                      variant.quantity,
                                      productIndex,
                                      index
                                    )
                                  }
                                  className="bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center"
                                >
                                  <FaMinus />
                                </button>

                                <p className="flex-1 w-full font-semibold px-1 flex items-center justify-center">
                                  {variant.quantity}
                                </p>

                                <button
                                  onClick={()=> 
                                    increaseQty(
                                    variant.quantity,
                                      productIndex,
                                      index
                                  )}
                                  className="bg-green-600 hover:bg-green-700 text-white flex-1 w-full p-1 rounded flex items-center justify-center"
                                >
                                  <FaPlus />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="bg-white p-4">
                <h3 className="font-semibold">Bill details</h3>
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
                  <p className="flex items-center gap-2">{totalQty} items</p>
                </div>
                <div className="flex gap-4 justify-between ml-1">
                  <p>Delivery Charge</p>
                  <p className="flex items-center gap-2">Free</p>
                </div>
                <div className="font-semibold flex items-center justify-between gap-4">
                  <p>Grand total</p>
                  <p>{DisplayPriceInRupees(totalPrice)}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white flex flex-col justify-center items-center">
              <img
                src={imageEmpty}
                className="w-full h-full object-scale-down"
                alt="Cart is empty"
              />
              <Link
                onClick={close}
                to={"/"}
                className="block bg-green-600 px-4 py-2 text-white rounded"
              >
                Shop Now
              </Link>
            </div>
          )}

          {cartItems.length > 0 && (
            <div className="p-2">
              <div className="bg-green-700 text-neutral-100 px-4 font-bold text-base py-4 static bottom-3 rounded flex items-center gap-4 justify-between">
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
          )}
        </div>
      </div>
    </section>
  );
};

export default DisplayCartItem;
