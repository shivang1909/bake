// import React, { useEffect, useMemo, useState } from "react";
// import { useGlobalContext } from "../provider/GlobalProvider";
// import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
// import AddAddress from "../components/AddAddress";
// import { useDispatch, useSelector } from "react-redux";
// import AxiosToastError from "../utils/AxiosToastError";
// import Axios from "../utils/Axios";
// import SummaryApi from "../common/SummaryApi";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import { pricewithDiscount } from "../utils/PriceWithDiscount";
// import { updatedShoppingCart } from "../store/userSlice";
// import wrapprice from "../utils/wrapprice.json";
// const CheckoutPage = () => {
//   const [openAddress, setOpenAddress] = useState(false);
//   const [GiftWrapCharges, setGiftWrapCharges] = useState(0);
//   const addressList = useSelector((state) => state.addresses.addressList);
//   const dispatch = useDispatch();
//   const [selectAddress, setSelectAddress] = useState(0);
//   // const cartItemsList = useSelector(state => state.cartItem.cart)
//   const navigate = useNavigate();
//   const { setTotalQty, setCartItem } = useGlobalContext();
//   const [checkoutItems, setcheckoutItems] = useState([]);
//   const [giftNoteEditable, setGiftNoteEditable] = useState({});


//   const handleGiftNoteEdit = (productIndex, variantIndex) => {
//     setGiftNoteEditable((prev) => ({
//       ...prev,
//       [`${productIndex}-${variantIndex}`]: true, // Enable input when editing
//     }));
//   };


//   console.log(checkoutItems);
//   const [giftNotes, setGiftNotes] = useState({});

// const handleGiftNoteChange = (productIndex, variantIndex, note) => {
//   setGiftNotes((prevNotes) => ({
//     ...prevNotes,
//     [`${productIndex}-${variantIndex}`]: note, // Store note uniquely per item-variant
//   }));
// };

// const handleGiftNoteSave = (productIndex, variantIndex) => {
//   setGiftNoteEditable((prev) => ({
//     ...prev,
//     [`${productIndex}-${variantIndex}`]: false, // Disable input after saving
//   }));
//   setcheckoutItems((prevItems) => {
//     const updatedItems = [...prevItems]; // Create a shallow copy of the array
//     updatedItems[productIndex] = {
//       ...updatedItems[productIndex], // Copy the specific product
//       variantPrices: updatedItems[productIndex].variantPrices.map(
//         (variant, vIndex) =>
//           vIndex === variantIndex
//             ? { ...variant, giftNote: giftNotes[`${productIndex}-${variantIndex}`] || "" } // Save the gift note
//             : variant
//       ),
//     };
//     return updatedItems; // Set the updated array
//   });

//   console.log(
//     `Saved Gift Note for Product ${productIndex}, Variant ${variantIndex}:`,
//     giftNotes[`${productIndex}-${variantIndex}`]
//   );
// };

// const handleGiftWrapChange = (productIndex, variantIndex, isChecked) => {
//   const variantWeight = checkoutItems[productIndex].variantPrices[variantIndex].weight; // Get weight
//   const quantity = checkoutItems[productIndex].variantPrices[variantIndex].quantity; // Get quantity
//   const variantPrice = wrapprice[variantWeight] * quantity; // Get gift wrap price

//   // Only add price when checked
//   if (isChecked) {
//     setGiftWrapCharges((prevCharges) => prevCharges + variantPrice);
//   }

//   setcheckoutItems((prevItems) => {
//     const updatedItems = [...prevItems];

//     updatedItems[productIndex] = {
//       ...updatedItems[productIndex],
//       variantPrices: updatedItems[productIndex].variantPrices.map((variant, vIndex) =>
//         vIndex === variantIndex
//           ? {
//               ...variant,
//               isGiftWrap: isChecked,
//               giftNote: isChecked ? variant.giftNote : "", // Remove note if unchecked
//             }
//           : variant
//       ),
//     };

//     return updatedItems;
//   });

//   // If unchecked, remove the gift wrap charge and gift note
//   if (!isChecked) {
//     setGiftWrapCharges((prevCharges) => prevCharges - variantPrice);
//     setGiftNotes((prevNotes) => {
//       const updatedNotes = { ...prevNotes };
//       delete updatedNotes[`${productIndex}-${variantIndex}`]; // Remove note from state
//       return updatedNotes;
//     });
//   }

//   console.log('Updated Checkout Items:', checkoutItems);
// };



//   const handleCashOnDelivery = async () => {
//     try {
//       console.log(checkoutItems);
//       const response = await Axios({
//         ...SummaryApi.CashOnDeliveryOrder,
//         data: {
//           list_items: checkoutItems,
//           addressId: addressList[selectAddress]?._id,
//           total: (finalTotal - discountedPrice)+GiftWrapCharges,
//         },
//       });
//       const { data: responseData } = response;

//       if (responseData.success) {
//         toast.success(responseData.message);
//         setCartItem([]);
//         dispatch(updatedShoppingCart([]));
//         setTotalQty(0);
//         navigate("/success", {
//           state: {
//             text: "Order",
//           },
//         });
//       }
//     } catch (error) {
//       console.log(error);
//       AxiosToastError(error);
//     }
//   };

//   const handleOnlinePayment = async () => {
//     try {
//       toast.loading("Loading...");
//       const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
//       const stripePromise = await loadStripe(stripePublicKey);

//       const response = await Axios({
//         ...SummaryApi.payment_url,
//         data: {
//           list_items: cartItemsList,
//           addressId: addressList[selectAddress]?._id,
//           subTotalAmt: finalTotal - discountedPrice,
//           total: (finalTotal - discountedPrice)+GiftWrapCharges,

//         },
//       });

//       const { data: responseData } = response;

//       stripePromise.redirectToCheckout({ sessionId: responseData.id });

//       if (fetchCartItem) {
//         fetchCartItem();
//       }
//       if (fetchOrder) {
//         fetchOrder();
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };

//   const { finalTotal, quantity, discountedPrice } = useMemo(() => {
//     let finalTotal = 0;
//     let quantity = 0;
//     let discountedPrice = 0;

//     for (let i = 0; i < checkoutItems.length; i++) {
//       let eachDiscount = 0;
//       for (let j = 0; j < checkoutItems[i].variantPrices.length; j++) {
//         finalTotal =
//           finalTotal +
//           checkoutItems[i].variantPrices[j].price *
//             checkoutItems[i].variantPrices[j].quantity;
//         quantity = quantity + checkoutItems[i].variantPrices[j].quantity;
//         eachDiscount =
//           checkoutItems[i].variantPrices[j].price *
//           checkoutItems[i].variantPrices[j].quantity *
//           (checkoutItems[i].variantPrices[j].discount / 100);
//         console.log(eachDiscount);

//         discountedPrice = discountedPrice + eachDiscount;
//       }
//     }

//     return { finalTotal, quantity, discountedPrice };
//   }, [checkoutItems]);

//   useEffect(() => {
//     const fetchCartDetails = async () => {
//       try {
//         const response = await Axios({
//           ...SummaryApi.usercartdetails,
//         });
//         const { data: responseData } = response;
//         if (responseData.success) {
//           console.log(responseData.data);
//           setcheckoutItems(responseData.data);
//         }
//       } catch (error) {
//         console.error("Error fetching cart details:", error);
//       }
//     };
//     fetchCartDetails();
//   }, []);

//   return (
//     <section className="bg-blue-50">
//       {console.log(checkoutItems)}
//       <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
//         <div className="w-full">
//           {/***address***/}
//           <h3 className="text-lg font-semibold">Choose your address</h3>
//           <div className="bg-white p-2 grid gap-4">
//             {addressList.map((address, index) => {
//               return (
//                 <label
//                   htmlFor={"address" + index}
//                   className={!address.status && "hidden"}
//                 >
//                   <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
//                     <div>
//                       <input
//                         id={"address" + index}
//                         type="radio"
//                         value={index}
//                         onChange={(e) => setSelectAddress(e.target.value)}
//                         name="address"
//                       />
//                     </div>
//                     <div>
//                       <p>{address.address_line}</p>
//                       <p>{address.city}</p>
//                       <p>{address.state}</p>
//                       <p>
//                         {address.country} - {address.pincode}
//                       </p>
//                       <p>{address.mobile}</p>
//                     </div>
//                   </div>
//                 </label>
//               );
//             })}
//             <div
//               onClick={() => setOpenAddress(true)}
//               className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer"
//             >
//               Add address
//             </div>
//           </div>
//         </div>

//         <div className="w-full max-w-md bg-white py-4 px-2">
//           {/**summary**/}
//           {checkoutItems.length > 0 ? (
//             <>
//               <div className="flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full">
//                 <p>Your total savings</p>
//                 <p>{DisplayPriceInRupees(discountedPrice)}</p>
//               </div>
//               <div className="bg-white rounded-lg p-4 grid gap-5 overflow-auto">
//                 {checkoutItems.map((item, productIndex) =>
//                   item.variantPrices.map((variant, index) => (
//                     <div
//                       key={`${item.productId}_product_${index}`}
//                       className="flex flex-col w-full gap-4 border-b pb-4"
//                     >
//                       {console.log(item)}
//                       <div className="mt-2">
//                         <label className="flex items-center gap-2">
//                           <input
//                             type="checkbox"
//                             onChange={(e) =>
//                               handleGiftWrapChange(
//                                 productIndex,
//                                 index,
//                                 e.target.checked
//                               )
//                             }
//                             className="w-4 h-4"
//                           />
//                           <span className="text-sm">Add Gift Wrap</span>
//                         </label>
//                       </div>
//                       {variant.isGiftWrap && (
//   <div className="mt-2 flex items-center gap-2">
//     <input
//       type="text"
//       placeholder="Enter gift note"
//       value={giftNotes[`${productIndex}-${index}`] || ""}
//       onChange={(e) => handleGiftNoteChange(productIndex, index, e.target.value)}
//       disabled={!giftNoteEditable[`${productIndex}-${index}`]} // Disable after saving
//       className={`border p-2 rounded ${!giftNoteEditable[`${productIndex}-${index}`] ? 'bg-gray-200' : ''}`}
//     />

//     {!giftNoteEditable[`${productIndex}-${index}`] ? (
//       <button
//         className="bg-blue-500 text-white px-4 py-2 rounded"
//         onClick={() => handleGiftNoteEdit(productIndex, index)}
//       >
//         Edit
//       </button>
//     ) : (
//       <button
//         className="bg-green-500 text-white px-4 py-2 rounded"
//         onClick={() => handleGiftNoteSave(productIndex, index)}
//       >
//         Save
//       </button>
//     )}
//   </div>
// )}

//                       <div className="flex gap-4 items-start">
//                         <div className="w-16 h-16 bg-red-500 border rounded">
//                           <img
//                             src={item.coverimage}
//                             alt={item.name}
//                             className="w-full h-full object-scale-down"
//                           />
//                         </div>
//                         <div className="w-full">
//                           <p className="text-sm font-semibold">
//                             {item.itemname}
//                           </p>

//                           <div
//                             key={`${item.productId}_variant_${index}`}
//                             className="flex justify-between items-center mt-2"
//                           >
//                             <div>
//                               <p className="text-xs text-neutral-400">
//                                 Weight: {variant.weight}
//                               </p>
//                               <p className="font-semibold">
//                                 {DisplayPriceInRupees(
//                                   pricewithDiscount(
//                                     variant.price,
//                                     variant.discount
//                                   ) * variant.quantity
//                                 )}
//                               </p>
//                             </div>
//                             <div className="w-full max-w-[150px]">
//                               <div className="flex w-full h-full">
//                                 <p className="flex-1 w-full font-semibold px-1 flex items-center justify-center">
//                                   Quantity: {variant.quantity}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//               <div className="bg-white p-4">
//                 <h3 className="font-semibold">Bill details</h3>
//                 <div className="flex gap-4 justify-between ml-1">
//                   <p>Items total</p>
//                   <p className="flex items-center gap-2">
//                     <span className="line-through text-neutral-400">
//                       {DisplayPriceInRupees(finalTotal)}
//                     </span>
//                     <span>
//                       {DisplayPriceInRupees(finalTotal - discountedPrice)}
//                     </span>
//                   </p>
//                 </div>
//                 <div className="flex gap-4 justify-between ml-1">
//                   <p>Quantity total</p>
//                   <p className="flex items-center gap-2">{quantity} items</p>
//                 </div>
//                 <div className="flex gap-4 justify-between ml-1">
//                   <p>Delivery Charge</p>
//                   <p className="flex items-center gap-2">Free</p>
//                 </div>
//                 <div className="flex gap-4 justify-between ml-1">
//                   <p>GiftWrap Charges </p>
//                   <p className="flex items-center gap-2">
//                     {GiftWrapCharges}
//                   </p>
//                 </div>
//                 <div className="font-semibold flex items-center justify-between gap-4">
//                   <p>Grand total</p>
//                   <p>{DisplayPriceInRupees((finalTotal - discountedPrice)+GiftWrapCharges)}</p>
//                 </div>
//               </div>
//               <div className="w-full flex flex-col gap-4">
//                 <button
//                   className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
//                   onClick={handleOnlinePayment}
//                 >
//                   Online Payment
//                 </button>

//                 <button
//                   className="py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white"
//                   onClick={handleCashOnDelivery}
//                 >
//                   Cash on Delivery
//                 </button>
//               </div>
//             </>
//           ) : (
//             "Helo"
//           )}
//         </div>
//       </div>

//       {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
//     </section>
//   );
// };

// export default CheckoutPage;


// import React, { useEffect, useMemo, useState } from "react";
// import { useGlobalContext } from "../provider/GlobalProvider";
// import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
// import AddAddress from "../components/AddAddress";
// import { useDispatch, useSelector } from "react-redux";
// import AxiosToastError from "../utils/AxiosToastError";
// import Axios from "../utils/Axios";
// import SummaryApi from "../common/SummaryApi";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import { loadStripe } from "@stripe/stripe-js";
// import { pricewithDiscount } from "../utils/PriceWithDiscount";
// import { updatedShoppingCart } from "../store/userSlice";
// import wrapprice from "../utils/wrapprice.json";

// const CheckoutPage = () => {
//   const [openAddress, setOpenAddress] = useState(false);
//   const [GiftWrapCharges, setGiftWrapCharges] = useState(0);
//   const addressList = useSelector((state) => state.addresses.addressList);
//   const dispatch = useDispatch();
//   const [selectAddress, setSelectAddress] = useState(0);
//   const navigate = useNavigate();
//   const { setTotalQty, setCartItem } = useGlobalContext();
//   const [checkoutItems, setcheckoutItems] = useState([]);
//   const [giftNoteEditable, setGiftNoteEditable] = useState({});
//   const [giftNotes, setGiftNotes] = useState({});

//   const handleGiftNoteEdit = (productIndex, variantIndex) => {
//     setGiftNoteEditable((prev) => ({
//       ...prev,
//       [`${productIndex}-${variantIndex}`]: true,
//     }));
//   };

//   const handleGiftNoteChange = (productIndex, variantIndex, note) => {
//     setGiftNotes((prevNotes) => ({
//       ...prevNotes,
//       [`${productIndex}-${variantIndex}`]: note,
//     }));
//   };

//   const handleGiftNoteSave = (productIndex, variantIndex) => {
//     setGiftNoteEditable((prev) => ({
//       ...prev,
//       [`${productIndex}-${variantIndex}`]: false,
//     }));
//     setcheckoutItems((prevItems) => {
//       const updatedItems = [...prevItems];
//       updatedItems[productIndex] = {
//         ...updatedItems[productIndex],
//         variantPrices: updatedItems[productIndex].variantPrices.map(
//           (variant, vIndex) =>
//             vIndex === variantIndex
//               ? { ...variant, giftNote: giftNotes[`${productIndex}-${variantIndex}`] || "" }
//               : variant
//         ),
//       };
//       return updatedItems;
//     });
//   };

//   const handleGiftWrapChange = (productIndex, variantIndex, isChecked) => {
//     const variantWeight = checkoutItems[productIndex].variantPrices[variantIndex].weight;
//     const quantity = checkoutItems[productIndex].variantPrices[variantIndex].quantity;
//     const variantPrice = wrapprice[variantWeight] * quantity;

//     if (isChecked) {
//       setGiftWrapCharges((prevCharges) => prevCharges + variantPrice);
//     }

//     setcheckoutItems((prevItems) => {
//       const updatedItems = [...prevItems];

//       updatedItems[productIndex] = {
//         ...updatedItems[productIndex],
//         variantPrices: updatedItems[productIndex].variantPrices.map((variant, vIndex) =>
//           vIndex === variantIndex
//             ? {
//                 ...variant,
//                 isGiftWrap: isChecked,
//                 giftNote: isChecked ? variant.giftNote : "",
//               }
//             : variant
//         ),
//       };

//       return updatedItems;
//     });

//     if (!isChecked) {
//       setGiftWrapCharges((prevCharges) => prevCharges - variantPrice);
//       setGiftNotes((prevNotes) => {
//         const updatedNotes = { ...prevNotes };
//         delete updatedNotes[`${productIndex}-${variantIndex}`];
//         return updatedNotes;
//       });
//     }
//   };

//   const handleCashOnDelivery = async () => {
//     try {
//       const response = await Axios({
//         ...SummaryApi.CashOnDeliveryOrder,
//         data: {
//           list_items: checkoutItems,
//           addressId: addressList[selectAddress]?._id,
//           total: (finalTotal - discountedPrice) + GiftWrapCharges,
//         },
//       });
//       const { data: responseData } = response;

//       if (responseData.success) {
//         toast.success(responseData.message);
//         setCartItem([]);
//         dispatch(updatedShoppingCart([]));
//         setTotalQty(0);
//         navigate("/success", {
//           state: {
//             text: "Order",
//           },
//         });
//       }
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };

//   const handleOnlinePayment = async () => {
//     try {
//       toast.loading("Loading...");
//       const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
//       const stripePromise = await loadStripe(stripePublicKey);

//       const response = await Axios({
//         ...SummaryApi.payment_url,
//         data: {
//           list_items: checkoutItems,
//           addressId: addressList[selectAddress]?._id,
//           subTotalAmt: finalTotal - discountedPrice,
//           total: (finalTotal - discountedPrice) + GiftWrapCharges,
//         },
//       });

//       const { data: responseData } = response;
//       stripePromise.redirectToCheckout({ sessionId: responseData.id });
//     } catch (error) {
//       AxiosToastError(error);
//     }
//   };

//   const { finalTotal, quantity, discountedPrice } = useMemo(() => {
//     let finalTotal = 0;
//     let quantity = 0;
//     let discountedPrice = 0;

//     for (let i = 0; i < checkoutItems.length; i++) {
//       for (let j = 0; j < checkoutItems[i].variantPrices.length; j++) {
//         finalTotal =
//           finalTotal +
//           checkoutItems[i].variantPrices[j].price *
//             checkoutItems[i].variantPrices[j].quantity;
//         quantity = quantity + checkoutItems[i].variantPrices[j].quantity;
//         const eachDiscount =
//           checkoutItems[i].variantPrices[j].price *
//           checkoutItems[i].variantPrices[j].quantity *
//           (checkoutItems[i].variantPrices[j].discount / 100);
//         discountedPrice = discountedPrice + eachDiscount;
//       }
//     }

//     return { finalTotal, quantity, discountedPrice };
//   }, [checkoutItems]);

//   useEffect(() => {
//     const fetchCartDetails = async () => {
//       try {
//         const response = await Axios({
//           ...SummaryApi.usercartdetails,
//         });
//         const { data: responseData } = response;
//         if (responseData.success) {
//           setcheckoutItems(responseData.data);
//         }
//       } catch (error) {
//         console.error("Error fetching cart details:", error);
//       }
//     };
//     fetchCartDetails();
//   }, []);

//   return (
//     <section className="bg-blue-50">
//       <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
//         <div className="w-full">
//           {/***address***/}
//           <h3 className="text-lg font-semibold">Choose your address</h3>
//           <div className="bg-white p-2 grid gap-4">
//             {addressList.map((address, index) => {
//               return (
//                 <label
//                   key={index}
//                   htmlFor={"address" + index}
//                   className={!address.status && "hidden"}
//                 >
//                   <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
//                     <div>
//                       <input
//                         id={"address" + index}
//                         type="radio"
//                         value={index}
//                         onChange={(e) => setSelectAddress(e.target.value)}
//                         name="address"
//                       />
//                     </div>
//                     <div>
//                       <p>{address.address_line}</p>
//                       <p>{address.city}</p>
//                       <p>{address.state}</p>
//                       <p>
//                         {address.country} - {address.pincode}
//                       </p>
//                       <p>{address.mobile}</p>
//                     </div>
//                   </div>
//                 </label>
//               );
//             })}
//             <div
//               onClick={() => setOpenAddress(true)}
//               className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer"
//             >
//               Add address
//             </div>
//           </div>
//         </div>

//         <div className="w-full max-w-md bg-white py-4 px-2">
//           {/**summary**/}
//           {checkoutItems.length > 0 ? (
//             <>
//               <div className="flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full">
//                 <p>Your total savings</p>
//                 <p>{DisplayPriceInRupees(discountedPrice)}</p>
//               </div>
//               <div className="bg-white rounded-lg p-4 grid gap-5 overflow-auto">
//                 {checkoutItems.map((item, productIndex) =>
//                   item.variantPrices.map((variant, index) => (
//                     <div
//                       key={`${item.productId}_product_${index}`}
//                       className="flex flex-col w-full gap-4 border-b pb-4"
//                     >
//                       <div className="mt-2">
//                         <label className="flex items-center gap-2">
//                           <input
//                             type="checkbox"
//                             onChange={(e) =>
//                               handleGiftWrapChange(
//                                 productIndex,
//                                 index,
//                                 e.target.checked
//                               )
//                             }
//                             className="w-4 h-4"
//                           />
//                           <span className="text-sm">Add Gift Wrap</span>
//                         </label>
//                       </div>
//                       {variant.isGiftWrap && (
//                         <div className="mt-2 flex items-center gap-2">
//                           <input
//                             type="text"
//                             placeholder="Enter gift note"
//                             value={giftNotes[`${productIndex}-${index}`] || ""}
//                             onChange={(e) => handleGiftNoteChange(productIndex, index, e.target.value)}
//                             disabled={!giftNoteEditable[`${productIndex}-${index}`]}
//                             className={`border p-2 rounded ${!giftNoteEditable[`${productIndex}-${index}`] ? 'bg-gray-200' : ''}`}
//                           />

//                           {!giftNoteEditable[`${productIndex}-${index}`] ? (
//                             <button
//                               className="bg-blue-500 text-white px-4 py-2 rounded"
//                               onClick={() => handleGiftNoteEdit(productIndex, index)}
//                             >
//                               Edit
//                             </button>
//                           ) : (
//                             <button
//                               className="bg-green-500 text-white px-4 py-2 rounded"
//                               onClick={() => handleGiftNoteSave(productIndex, index)}
//                             >
//                               Save
//                             </button>
//                           )}
//                         </div>
//                       )}

//                       <div className="flex gap-4 items-start">
//                         <div className="w-16 h-16 bg-red-500 border rounded">
//                           <img
//                             src={item.coverimage}
//                             alt={item.name}
//                             className="w-full h-full object-scale-down"
//                           />
//                         </div>
//                         <div className="w-full">
//                           <p className="text-sm font-semibold">
//                             {item.itemname}
//                           </p>

//                           <div
//                             key={`${item.productId}_variant_${index}`}
//                             className="flex justify-between items-center mt-2"
//                           >
//                             <div>
//                               <p className="text-xs text-neutral-400">
//                                 Weight: {variant.weight}
//                               </p>
//                               <p className="font-semibold">
//                                 {DisplayPriceInRupees(
//                                   pricewithDiscount(
//                                     variant.price,
//                                     variant.discount
//                                   ) * variant.quantity
//                                 )}
//                               </p>
//                             </div>
//                             <div className="w-full max-w-[150px]">
//                               <div className="flex w-full h-full">
//                                 <p className="flex-1 w-full font-semibold px-1 flex items-center justify-center">
//                                   Quantity: {variant.quantity}
//                                 </p>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>
//               <div className="bg-white p-4">
//                 <h3 className="font-semibold">Bill details</h3>
//                 <div className="flex gap-4 justify-between ml-1">
//                   <p>Items total</p>
//                   <p className="flex items-center gap-2">
//                     <span className="line-through text-neutral-400">
//                       {DisplayPriceInRupees(finalTotal)}
//                     </span>
//                     <span>
//                       {DisplayPriceInRupees(finalTotal - discountedPrice)}
//                     </span>
//                   </p>
//                 </div>
//                 <div className="flex gap-4 justify-between ml-1">
//                   <p>Quantity total</p>
//                   <p className="flex items-center gap-2">{quantity} items</p>
//                 </div>
//                 <div className="flex gap-4 justify-between ml-1">
//                   <p>Delivery Charge</p>
//                   <p className="flex items-center gap-2">Free</p>
//                 </div>
//                 <div className="flex gap-4 justify-between ml-1">
//                   <p>GiftWrap Charges </p>
//                   <p className="flex items-center gap-2">
//                     {GiftWrapCharges}
//                   </p>
//                 </div>
//                 <div className="font-semibold flex items-center justify-between gap-4">
//                   <p>Grand total</p>
//                   <p>{DisplayPriceInRupees((finalTotal - discountedPrice) + GiftWrapCharges)}</p>
//                 </div>
//               </div>
//               <div className="w-full flex flex-col gap-4">
//                 <button
//                   className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
//                   onClick={handleOnlinePayment}
//                 >
//                   Online Payment
//                 </button>

//                 <button
//                   className="py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white"
//                   onClick={handleCashOnDelivery}
//                 >
//                   Cash on Delivery
//                 </button>
//               </div>
//             </>
//           ) : (
//             "Loading..."
//           )}
//         </div>
//       </div>

//       {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
//     </section>
//   );
// };

// export default CheckoutPage;

import React, { useEffect, useMemo, useState } from "react";
import { useGlobalContext } from "../provider/GlobalProvider";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import AddAddress from "../components/AddAddress";
import { useDispatch, useSelector } from "react-redux";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { pricewithDiscount } from "../utils/PriceWithDiscount";
import { updatedShoppingCart } from "../store/userSlice";
import wrapprice from "../utils/wrapprice.json";

const CheckoutPage = () => {
  const [openAddress, setOpenAddress] = useState(false);
  const [GiftWrapCharges, setGiftWrapCharges] = useState(0);
  const addressList = useSelector((state) => state.addresses.addressList);
  const dispatch = useDispatch();
  const [selectAddress, setSelectAddress] = useState(0);
  const navigate = useNavigate();
  const { setTotalQty, setCartItem } = useGlobalContext();
  const [checkoutItems, setcheckoutItems] = useState([]);
  const [giftNoteEditable, setGiftNoteEditable] = useState({});
  const [giftNotes, setGiftNotes] = useState({});
  
  // Promocode states
  const [promocodes, setPromocodes] = useState([]);
  const [selectedPromocode, setSelectedPromocode] = useState("");
  const [showPromocodes, setShowPromocodes] = useState(false);
  const [appliedPromocode, setAppliedPromocode] = useState(null);
  const [promocodeDiscount, setPromocodeDiscount] = useState(0);
  const [isLoadingPromocode, setIsLoadingPromocode] = useState(false);

  const handleGiftNoteEdit = (productIndex, variantIndex) => {
    setGiftNoteEditable((prev) => ({
      ...prev,
      [`${productIndex}-${variantIndex}`]: true,
    }));
  };

  const handleGiftNoteChange = (productIndex, variantIndex, note) => {
    setGiftNotes((prevNotes) => ({
      ...prevNotes,
      [`${productIndex}-${variantIndex}`]: note,
    }));
  };

  const handleGiftNoteSave = (productIndex, variantIndex) => {
    setGiftNoteEditable((prev) => ({
      ...prev,
      [`${productIndex}-${variantIndex}`]: false,
    }));
    setcheckoutItems((prevItems) => {
      const updatedItems = [...prevItems];
      updatedItems[productIndex] = {
        ...updatedItems[productIndex],
        variantPrices: updatedItems[productIndex].variantPrices.map(
          (variant, vIndex) =>
            vIndex === variantIndex
              ? { ...variant, giftNote: giftNotes[`${productIndex}-${variantIndex}`] || "" }
              : variant
        ),
      };
      return updatedItems;
    });
  };

  const handleGiftWrapChange = (productIndex, variantIndex, isChecked) => {
    const variantWeight = checkoutItems[productIndex].variantPrices[variantIndex].weight;
    const quantity = checkoutItems[productIndex].variantPrices[variantIndex].quantity;
    const variantPrice = wrapprice[variantWeight] * quantity;

    if (isChecked) {
      setGiftWrapCharges((prevCharges) => prevCharges + variantPrice);
    }

    setcheckoutItems((prevItems) => {
      const updatedItems = [...prevItems];

      updatedItems[productIndex] = {
        ...updatedItems[productIndex],
        variantPrices: updatedItems[productIndex].variantPrices.map((variant, vIndex) =>
          vIndex === variantIndex
            ? {
                ...variant,
                isGiftWrap: isChecked,
                giftNote: isChecked ? variant.giftNote : "",
                giftWrapCharge: isChecked ? wrapprice[variantWeight] * quantity : 0,
              }
            : variant
        ),
      };

      return updatedItems;
    });

    if (!isChecked) {
      setGiftWrapCharges((prevCharges) => prevCharges - variantPrice);
      setGiftNotes((prevNotes) => {
        const updatedNotes = { ...prevNotes };
        delete updatedNotes[`${productIndex}-${variantIndex}`];
        return updatedNotes;
      });
    }
  };

 
  // Apply promocode
  const applyPromocode = async () => {
    if (!selectedPromocode) {
      toast.error("Please enter a promocode");
      return;
    }

    try {
      setIsLoadingPromocode(true);
      const response = await Axios({
        method: "POST",
        url: "/api/promocode/verify",
        data: {
          code: selectedPromocode.code,
          orderAmount: finalTotal - discountedPrice,
        },
      });

      if (response.data.success) {
        setAppliedPromocode(selectedPromocode);
        setPromocodeDiscount(response.data.data.discountAmount);
        toast.success("Promocode applied successfully!");
        setShowPromocodes(false);
      }
    } catch (error) {
      setSelectedPromocode(null);
      setAppliedPromocode(null);
      toast.error(error.response?.data?.message || "Failed to apply promocode");
    } finally {
      setIsLoadingPromocode(false);
    }
  };

  // Remove applied promocode
  const removePromocode = () => {
    setAppliedPromocode(null);
    setPromocodeDiscount(0);
    setSelectedPromocode("");
    toast.success("Promocode removed");
  };

  const handleSelectPromocode = (code) => {
    setSelectedPromocode(code);
  };

  const handleCashOnDelivery = async () => {
    try {
      toast.loading("Processing order...");
      
      // Add gift wrap charge to each variant that has gift wrap
      const itemsWithGiftWrapCharge = checkoutItems.map(item => ({
        ...item,
        variantPrices: item.variantPrices.map(variant => {
          if (variant.isGiftWrap) {
            return {
              ...variant,
              giftWrapCharge: wrapprice[variant.weight] * variant.quantity
            };
          }
          return variant;
        })
      }));
      
      const response = await Axios({
        ...SummaryApi.CashOnDeliveryOrder,
        data: {
          list_items: itemsWithGiftWrapCharge,
          addressId: addressList[selectAddress]?._id,
          total: (finalTotal - discountedPrice - promocodeDiscount) + GiftWrapCharges,
          promocodeId: appliedPromocode?._id || null,
          promocodeDiscount: promocodeDiscount || 0
        },
      });
      
      toast.dismiss();
      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        setCartItem([]);
        dispatch(updatedShoppingCart([]));
        setTotalQty(0);
        navigate("/success", {
          state: {
            text: "Order",
          },
        });
      }
    } catch (error) {
      toast.dismiss();
      AxiosToastError(error);
    }
  };

  const handleOnlinePayment = async () => {
    try {
      toast.loading("Redirecting to payment...");
      const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
      const stripePromise = await loadStripe(stripePublicKey);
      
      // Add gift wrap charge to each variant that has gift wrap
      const itemsWithGiftWrapCharge = checkoutItems.map(item => ({
        ...item,
        variantPrices: item.variantPrices.map(variant => {
          if (variant.isGiftWrap) {
            return {
              ...variant,
              giftWrapCharge: wrapprice[variant.weight] * variant.quantity
            };
          }
          return variant;
        })
      }));

      const response = await Axios({
        ...SummaryApi.payment_url,
        data: {
          list_items: itemsWithGiftWrapCharge,
          addressId: addressList[selectAddress]?._id,
          subTotalAmt: finalTotal - discountedPrice,
          total: (finalTotal - discountedPrice - promocodeDiscount) + GiftWrapCharges,
          promocodeId: appliedPromocode?._id || null,
          promocodeDiscount: promocodeDiscount || 0
        },
      });

      const { data: responseData } = response;
      stripePromise.redirectToCheckout({ sessionId: responseData.id });
    } catch (error) {
      toast.dismiss();
      AxiosToastError(error);
    }
  };

  const { finalTotal, quantity, discountedPrice } = useMemo(() => {
    let finalTotal = 0;
    let quantity = 0;
    let discountedPrice = 0;

    for (let i = 0; i < checkoutItems.length; i++) {
      for (let j = 0; j < checkoutItems[i].variantPrices.length; j++) {
        finalTotal =
          finalTotal +
          checkoutItems[i].variantPrices[j].price *
            checkoutItems[i].variantPrices[j].quantity;
        quantity = quantity + checkoutItems[i].variantPrices[j].quantity;
        const eachDiscount =
          checkoutItems[i].variantPrices[j].price *
          checkoutItems[i].variantPrices[j].quantity *
          (checkoutItems[i].variantPrices[j].discount / 100);
        discountedPrice = discountedPrice + eachDiscount;
      }
    }

    return { finalTotal, quantity, discountedPrice };
  }, [checkoutItems]);


  useEffect(() => {
 // Fetch all promocodes
 const fetchPromocodes = async () => {
  try {
    console.log( finalTotal-discountedPrice);
    
    const response = await Axios({
      method: "POST",
      url: "/api/promocode/applicable",
      data: {
        orderAmount: finalTotal - discountedPrice,
      },
    });
    
    if (response.data.success) {
      setPromocodes(response.data.data);
    }
  } catch (error) {
    console.error("Error fetching promocodes:", error);
  }
};
fetchPromocodes();
  },[checkoutItems]);
 

  useEffect(() => {
    const fetchCartDetails = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.usercartdetails,
        });
        const { data: responseData } = response;
        if (responseData.success) {
          setcheckoutItems(responseData.data);
        }
      } catch (error) {
        console.error("Error fetching cart details:", error);
      }
    };
    fetchCartDetails();
    // fetchPromocodes();
  }, []);

  return (
    <section className="bg-blue-50">
      <div className="container mx-auto p-4 flex flex-col lg:flex-row w-full gap-5 justify-between">
        <div className="w-full">
          {/***address***/}
          <h3 className="text-lg font-semibold">Choose your address</h3>
          <div className="bg-white p-2 grid gap-4">
            {addressList.map((address, index) => {
              return (
                <label
                  key={index}
                  htmlFor={"address" + index}
                  className={!address.status && "hidden"}
                >
                  <div className="border rounded p-3 flex gap-3 hover:bg-blue-50">
                    <div>
                      <input
                        id={"address" + index}
                        type="radio"
                        value={index}
                        onChange={(e) => setSelectAddress(Number(e.target.value))}
                        name="address"
                        checked={selectAddress === index}
                      />
                    </div>
                    <div>
                      <p>{address.address_line}</p>
                      <p>{address.city}</p>
                      <p>{address.state}</p>
                      <p>
                        {address.country} - {address.pincode}
                      </p>
                      <p>{address.mobile}</p>
                    </div>
                  </div>
                </label>
              );
            })}
            <div
              onClick={() => setOpenAddress(true)}
              className="h-16 bg-blue-50 border-2 border-dashed flex justify-center items-center cursor-pointer"
            >
              Add address
            </div>
          </div>
        </div>

        <div className="w-full max-w-md bg-white py-4 px-2">
          {/**summary**/}
          {checkoutItems.length > 0 ? (
            <>
              <div className="flex items-center justify-between px-4 py-2 bg-blue-100 text-blue-500 rounded-full">
                <p>Your total savings</p>
                <p>{DisplayPriceInRupees(discountedPrice + promocodeDiscount)}</p>
              </div>
              <div className="bg-white rounded-lg p-4 grid gap-5 overflow-auto">
                {checkoutItems.map((item, productIndex) =>
                  item.variantPrices.map((variant, index) => (
                    <div
                      key={`${item.productId}_product_${index}`}
                      className="flex flex-col w-full gap-4 border-b pb-4"
                    >
                      <div className="mt-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            onChange={(e) =>
                              handleGiftWrapChange(
                                productIndex,
                                index,
                                e.target.checked
                              )
                            }
                            className="w-4 h-4"
                            checked={variant.isGiftWrap || false}
                          />
                          <span className="text-sm">Add Gift Wrap</span>
                        </label>
                      </div>
                      {variant.isGiftWrap && (
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Enter gift note"
                            value={giftNotes[`${productIndex}-${index}`] || variant.giftNote || ""}
                            onChange={(e) => handleGiftNoteChange(productIndex, index, e.target.value)}
                            disabled={!giftNoteEditable[`${productIndex}-${index}`]}
                            className={`border p-2 rounded w-full ${!giftNoteEditable[`${productIndex}-${index}`] ? 'bg-gray-100' : ''}`}
                          />

                          {!giftNoteEditable[`${productIndex}-${index}`] ? (
                            <button
                              className="bg-blue-500 text-white px-4 py-2 rounded whitespace-nowrap"
                              onClick={() => handleGiftNoteEdit(productIndex, index)}
                            >
                              Edit
                            </button>
                          ) : (
                            <button
                              className="bg-green-500 text-white px-4 py-2 rounded whitespace-nowrap"
                              onClick={() => handleGiftNoteSave(productIndex, index)}
                            >
                              Save
                            </button>
                          )}
                        </div>
                      )}

                      <div className="flex gap-4 items-start">
                        <div className="w-16 h-16 bg-gray-100 border rounded">
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
                                  ) * variant.quantity
                                )}
                              </p>
                            </div>
                            <div className="w-full max-w-[150px]">
                              <div className="flex w-full h-full">
                                <p className="flex-1 w-full font-semibold px-1 flex items-center justify-center">
                                  Quantity: {variant.quantity}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Promocode Section */}
              <div className="bg-white p-4 border-t">
                <h3 className="font-semibold mb-2">Apply Promocode</h3>
                
                {appliedPromocode ? (
                  <div className="bg-green-50 border border-green-200 p-3 rounded mb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{appliedPromocode.code}</p>
                        <p className="text-sm text-green-600">
                          {appliedPromocode.discountType === 'percentage' 
                            ? `${appliedPromocode.discountValue}% off` 
                            : `₹${appliedPromocode.discountValue} off`}
                        </p>
                        <p className="text-xs text-gray-500">
                          You saved {DisplayPriceInRupees(promocodeDiscount)}
                        </p>
                      </div>
                      <button 
                        onClick={removePromocode}
                        className="text-red-500 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={selectedPromocode?selectedPromocode.code:""}
                        placeholder="Enter Promocode"
                        className="flex-1 border p-2 rounded"
                        disabled
                      />
                      <button
                        onClick={applyPromocode}
                        disabled={isLoadingPromocode || !selectedPromocode}
                        className={`px-4 py-2 rounded text-white ${
                          isLoadingPromocode || !selectedPromocode 
                            ? 'bg-blue-300' 
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                        {isLoadingPromocode ? "Applying..." : "Apply"}
                      </button>
                    </div>
                    <button
                      onClick={() => setShowPromocodes(!showPromocodes)}
                      className="text-blue-500 text-sm mt-2 font-medium"
                    >
                      {showPromocodes ? "Hide Available Codes" : "View Available Promocodes"}
                    </button>
                    
                    {showPromocodes && (
                      <div className="mt-2 max-h-60 overflow-y-auto border rounded p-2">
                        {promocodes.length > 0 ? (
                          promocodes
                            .filter(code => code.isActive)
                            .map((code) => (
                              <div 
                                key={code._id}
                                className="border-b p-2 cursor-pointer hover:bg-blue-50"
                                onClick={() => handleSelectPromocode(code)}
                              >
                                <div className="flex justify-between">
                                  <p className="font-semibold">{code.code}</p>
                                  <p className="text-sm">{code.discountType === 'percentage' 
                                    ? `${code.discountValue}% off` 
                                    : `₹${code.discountValue} off`}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-500">
                                  Min order: ₹{code.minOrderValue} | 
                                  Expires: {new Date(code.expiryDate).toLocaleDateString()}
                                </p>
                              </div>
                            ))
                        ) : (
                          <p className="text-center p-2">No promocodes available</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="bg-white p-4">
                <h3 className="font-semibold">Bill details</h3>
                <div className="flex gap-4 justify-between ml-1">
                  <p>Items total</p>
                  <p className="flex items-center gap-2">
                    <span className="line-through text-neutral-400">
                      {DisplayPriceInRupees(finalTotal)}
                    </span>
                    <span>
                      {DisplayPriceInRupees(finalTotal - discountedPrice)}
                    </span>
                  </p>
                </div>
                <div className="flex gap-4 justify-between ml-1">
                  <p>Quantity total</p>
                  <p className="flex items-center gap-2">{quantity} items</p>
                </div>
                {promocodeDiscount > 0 && (
                  <div className="flex gap-4 justify-between ml-1 text-green-600">
                    <p>Promocode discount</p>
                    <p className="flex items-center gap-2">
                      - {DisplayPriceInRupees(promocodeDiscount)}
                    </p>
                  </div>
                )}
                <div className="flex gap-4 justify-between ml-1">
                  <p>Delivery Charge</p>
                  <p className="flex items-center gap-2">Free</p>
                </div>
                <div className="flex gap-4 justify-between ml-1">
                  <p>GiftWrap Charges </p>
                  <p className="flex items-center gap-2">
                    {DisplayPriceInRupees(GiftWrapCharges)}
                  </p>
                </div>
                <div className="font-semibold flex items-center justify-between gap-4 mt-2 pt-2 border-t">
                  <p>Grand total</p>
                  <p>{DisplayPriceInRupees((finalTotal - discountedPrice - promocodeDiscount) + GiftWrapCharges)}</p>
                </div>
              </div>
              <div className="w-full flex flex-col gap-4 mt-4">
                <button
                  className="py-2 px-4 bg-green-600 hover:bg-green-700 rounded text-white font-semibold"
                  onClick={handleOnlinePayment}
                  disabled={!addressList[selectAddress]}
                >
                  Online Payment
                </button>

                <button
                  className="py-2 px-4 border-2 border-green-600 font-semibold text-green-600 hover:bg-green-600 hover:text-white rounded"
                  onClick={handleCashOnDelivery}
                  disabled={!addressList[selectAddress]}
                >
                  Cash on Delivery
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500">NO data Found in CART</div>
            </div>
          )}
        </div>
      </div>

      {openAddress && <AddAddress close={() => setOpenAddress(false)} />}
    </section>
  );
};

export default CheckoutPage;