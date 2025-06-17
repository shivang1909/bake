// import React from 'react'
// import { useSelector } from 'react-redux'
// import NoData from '../components/NoData'

// const MyOrders = () => {
//   const orders = useSelector(state => state.orders.order)

//   console.log("order Items",orders)
//   return (
//     <div>
//       <div className='bg-white shadow-md p-3 font-semibold'>
//         <h1>Order</h1>
//       </div>
//         {
//           !orders[0] && (
//             <NoData/>
//           )
//         }
//         {
//           orders.map((order,index)=>{
//             return(
//               <div key={order._id+index+"order"} className='order rounded p-4 text-sm'>
//                   <p>Order No : {order?.orderId}</p>
//                   <div className='flex gap-3'>
//                     <img
//                       src={order.product_details.image[0]}
//                       className='w-14 h-14'
//                     />
//                     <p className='font-medium'>{order.product_details.name}</p>
//                   </div>
//               </div>
//             )
//           })
//         }
//     </div>
//   )
// }

// export default MyOrders

// import React, { useState } from "react";

// const staticOrders = [
//   {
//     orderId: "ORD-64c7636e3f93771b1c8454e1",
//     orderDate: "2025-02-19",
//     totalAmount: 365,
//     address: "123 Street, City, State",
//     paymentMethod: "CASH ON DELIVERY",
//     totalPrice: 330,
//     discount: 15,
//     finalPayable: 315,
//     packaging: 50,
//     deliveryCharges: "Free",
//     products: [
//       {
//         product_details: {
//           name: "Product Name 1",
//           image: "/images/product1.jpg"
//         },
//         variant: {
//           weight: "250g",
//           price: 105,
//           cartQty: 1
//         }
//       },
//       {
//         product_details: {
//           name: "Product Name 2",
//           image: "/images/product2.jpg"
//         },
//         variant: {
//           weight: "500g",
//           price: 210,
//           cartQty: 1
//         }
//       }
//     ]
//   },
//   {
//     orderId: "ORD-64c7636e3f93771b1c8454e2",
//     orderDate: "2025-02-18",
//     totalAmount: 150,
//     address: "456 Another Street, Another City",
//     paymentMethod: "ONLINE PAYMENT",
//     totalPrice: 150,
//     discount: 10,
//     finalPayable: 140,
//     packaging: 0,
//     deliveryCharges: "Free",
//     products: [
//       {
//         product_details: {
//           name: "Product Name 3",
//           image: "/images/product1.jpg"
//         },
//         variant: {
//           weight: "1kg",
//           price: 150,
//           cartQty: 1
//         }
//       }
//     ]
//   },
//   {
//     orderId: "ORD-64c7636e3f93771b1c8454e3",
//     orderDate: "2025-02-17",
//     totalAmount: 720,
//     address: "789 Some Avenue, City Center",
//     paymentMethod: "CASH ON DELIVERY",
//     totalPrice: 700,
//     discount: 20,
//     finalPayable: 700,
//     packaging: 20,
//     deliveryCharges: "Free",
//     products: [
//       {
//         product_details: {
//           name: "Product Name 4",
//           image: "/images/product4.jpg"
//         },
//         variant: {
//           weight: "500g",
//           price: 200,
//           cartQty: 2
//         }
//       },
//       {
//         product_details: {
//           name: "Product Name 5",
//           image: "/images/product5.jpg"
//         },
//         variant: {
//           weight: "250g",
//           price: 100,
//           cartQty: 1
//         }
//       },
//       {
//         product_details: {
//           name: "Product Name 6",
//           image: "/images/product6.jpg"
//         },
//         variant: {
//           weight: "750g",
//           price: 150,
//           cartQty: 1
//         }
//       }
//     ]
//   }
// ];

// const MyOrders = () => {
//   const [expandedOrder, setExpandedOrder] = useState(null);

//   const toggleMoreInfo = (orderId) => {
//     setExpandedOrder(expandedOrder === orderId ? null : orderId);
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen p-6">
//       <div className="bg-white shadow-md p-4 rounded-md font-semibold mb-4">
//         <h1 className="text-lg">My Orders</h1>
//       </div>

//       {staticOrders.length === 0 ? (
//         <div className="bg-white shadow-md p-4 rounded-md">
//           <p>No Orders Available</p>
//         </div>
//       ) : (
//         staticOrders.map((order) => (
//           <div
//             key={order.orderId}
//             className="bg-white shadow-md p-4 rounded-md mb-4 border border-gray-200 hover:shadow-lg transition-all duration-300"
//           >
//             {/* Order Overview */}
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="font-bold text-gray-800">Order No: {order.orderId}</p>
//                 <p className="text-gray-600 text-sm">Order Date: {order.orderDate}</p>
//                 <p className="text-gray-600 text-sm">Address: {order.address}</p>

//               </div>

//               <p className="font-medium text-gray-700">Payment Method {order.paymentMethod}</p>
//               <p className="font-medium text-gray-700">Total: ₹{(order.totalPrice - order.discount)+ order.packaging}</p>
//               <button
//                 onClick={() => toggleMoreInfo(order.orderId)}
//                 className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
//               >
//                 {expandedOrder === order.orderId ? "Hide Info" : "Click to More Info"}
//               </button>
//             </div>

//             {/* Expanded Section */}
//             {expandedOrder === order.orderId && (
//               <div className="mt-4 border-t pt-4">
//                 <h2 className="font-bold text-lg mb-2">Order Details</h2>

//                 {/* Address & Payment Info */}
//                 <div className="grid grid-cols-2 gap-4 mt-2 bg-gray-50 p-4 rounded-md">
//                   <div>
//                     <p className="font-medium">Address:</p>
//                     <p className="text-gray-600">{order.address}</p>
//                   </div>
//                   <div>
//                     <p className="font-medium">Payment Method:</p>
//                     <p className="text-gray-600">{order.paymentMethod}</p>
//                   </div>
//                 </div>
//                 <br />
//                 {/* Two-column layout for product info and bill info */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   {/* Product Details Section */}
//                   <div>
//                     <h3 className="font-bold text-md mb-2">Product Details</h3>
//                     {order.products.map((product, index) => (
//                       <div
//                         key={index}
//                         className="flex items-center gap-4 border-t border-gray-200 pt-4 mt-4"
//                       >
//                         <img
//                           src={product.product_details.image}
//                           alt={product.product_details.name}
//                           className="w-20 h-20 object-cover rounded-md border"
//                         />
//                         <div>
//                           <p className="font-bold">{product.product_details.name}</p>
//                           <p>
//                             <span className="font-medium">Weight:</span> {product.variant.weight}
//                           </p>
//                           <p>
//                             <span className="font-medium">Price:</span> ₹{product.variant.price}
//                           </p>
//                           <p>
//                             <span className="font-medium">Quantity:</span> {product.variant.cartQty}
//                           </p>
//                           <p>
//                             <span className="font-medium">Total:</span> ₹
//                             {product.variant.price * product.variant.cartQty}
//                           </p>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Bill Details Section */}
//                   <div className="bg-gray-50 p-4 rounded-md">
//                     <h3 className="font-bold text-md mb-2">Billing Summary</h3>
//                     <p className="font-medium">Total Price: ₹{order.totalPrice}</p>
//                     <p className="font-medium">Discount: ₹{order.discount}</p>
//                     <p className="font-medium">Discounted Price: ₹{order.totalPrice - order.discount}</p>
//                     <p className="font-medium">Packaging: ₹{order.packaging}</p>
//                     <p className="font-medium">Delivery Charges: {order.deliveryCharges}</p>
//                     <p className="font-bold mt-2 text-lg">Final Payable: ₹{(order.totalPrice - order.discount)+ order.packaging}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         ))
//       )}
//     </div>
//   );
// };

// export default MyOrders;

import { useState, useEffect } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { RxCross2 } from "react-icons/rx";
import { MdExpandMore, MdDownload } from "react-icons/md";
import { MdAccessTime } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import NoOrder from "../../assets/images/Custom/basket.png";
import ProfileSideBar from "../components/ProfileSideBar";
import { IoCaretBackOutline } from "react-icons/io5";
import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]); // Ensuring orders is always an array
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCancelMobileModal, setShowCancelMobileModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // const navigate = useNavigate();
  // const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // useEffect(() => {
  //   const handleResize = () => {
  //     setScreenWidth(window.innerWidth);
  //   };

  //   // Listen to resize
  //   window.addEventListener("resize", handleResize);

  //   // Initial check
  //   if (window.innerWidth > 1024) {
  //     navigate("/dashboard"); // or home
  //   }

  //   // Cleanup
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  // // Also check after resize
  // useEffect(() => {
  //   if (screenWidth > 1024) {
  //     navigate("/dashboard");
  //   }
  // }, [screenWidth]);

  // Call this to show the modal
  const openModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
    setTimeout(() => setAnimateModal(true), 10); // allow DOM to mount before animating
  };

  useEffect(() => {
    if (showCancelMobileModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showCancelMobileModal]);

  const openMobileModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelMobileModal(true);
    setTimeout(() => setAnimateModal(true), 10);
  };

  // Call this to close with animation
  const closeModal = () => {
    setAnimateModal(false);
    setTimeout(() => setShowCancelModal(false), 300); // wait for animation to finish
  };

  const closeMobileModel = () => {
    setAnimateModal(false);
    setTimeout(() => setShowCancelMobileModal(false), 300);
  };

  useEffect(() => {
    if (
      showCancelModal &&
      typeof window !== "undefined" &&
      navigator?.vibrate
    ) {
      // Light haptic feedback (like iOS tap)
      navigator.vibrate(10); // 10ms = soft tap
    }
  }, [showCancelModal, showCancelMobileModal]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await Axios({
          method: SummaryApi.getMyorderItems.method, // Dynamic method (GET)
          url: SummaryApi.getMyorderItems.url, // Dynamic URL
        });

        const data = Array.isArray(response.data) ? response.data : []; // Ensure response is an array
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]); // Set to empty array on error
      }
    };

    fetchOrders();
  }, []);
  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );
    if (!confirmCancel) return;

    try {
      const response = await Axios({
        method: SummaryApi.CancelOrder.method,
        url: SummaryApi.CancelOrder.url(orderId), // dynamic URL
      });

      alert("Order cancelled successfully!");

      // Optional: Refresh or update order status in UI
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: "Cancelled" } : order
        )
      );
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Failed to cancel order");
    }
  };

  const toggleMoreInfo = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  const downloadInvoice = async (order) => {
    console.log(order);
    const res = await Axios({
      ...SummaryApi.getInvoice,
      data: { order },
      responseType: "blob",
    });

    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    console.log(url);
    window.open(url, "_blank");
    window.URL.revokeObjectURL(url); // Optional cleanup
    console.log(res);
  };
  return (
    <>
      <div className="mb-20 md:mt-20 lg:mt-20 lg:h-[80vh]  flex flex-col md:flex-row gap-3 max-w-7xl mx-auto font-medium  overflow-hidden">
        <div>
          <ProfileSideBar activesection={"myorders"} />
        </div>
        <div className="md:w-3/4 bg-white md:p-6 h-full min-h-[50vh] overflow-y-auto px-2 mt-12 md:mt-0">
          {/* <div className="sm:block md:hidden flex justify-between items-center ">
                   <Link
                   to="/"
                   className="text-gray-500 flex gap-1 items-center justify-start px-2 py-3 mt-5"
                 >
                   <IoCaretBackOutline /> Go Back
                 </Link>
         
                 <div className="px-2 py-3 mt-5 flex items-center gap-1">
                  <span className="text-gray-700"> My Profile</span>
                 </div>
                 </div> */}
          {/* <div className="bg-white shadow-md p-4 rounded-md font-semibold mb-4">
        <h1 className="text-lg">My Orders</h1>
      </div> */}

          {orders.length === 0 ? (
            <div className="bg-white flex flex-col justify-center items-center rounded-xl p-8 text-center max-w-md mx-auto  h-[85vh] lg:h-auto">
              <div className="flex justify-center pb-5">
              <DotLottieReact
      src="https://lottie.host/3258c9bd-f493-4779-b94e-8871be687c25/GAws36NdeI.lottie"
      loop
      autoplay
    />
              </div>
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                No Orders Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Looks like you haven't placed <br /> any orders yet.
              </p>
              <button
                onClick={() => navigate("/shopall")}
                className="bg-gray-800 w-full text-white font-semibold py-2 px-6 rounded-full transition duration-300"
              >
                Shop Now
              </button>
            </div>
          ) : (
            orders
              .slice()
              .reverse()
              .map((order) => (
                <>
                  <div className="bg-gray-100 flex items-center justify-center w-full border-l-2 border-r-2 border-t-2 border-gray-200 rounded-t-full py-2">
                    <span className="text-green-500 text-lg font-semibold">
                      {["Assigned", "Not Assigned"].includes(order.orderStatus)
                        ? "Order Placed"
                        : order.orderStatus}
                    </span>
                  </div>
                  <div
                    key={order._id}
                    className="bg-gray-50 border-b-2 border-r-2 border-l-2 rounded-b-xl  pb-3 mb-3 p-2 md:p-4  hover:shadow-sm border-gray-200 transition-all duration-300"
                  >
                    <div className="bg-white rounded-xl p-0 md:p-4 mb-4 flex flex-col md:flex-row items-center justify-between gap-4">
                      {/* Left: Product Image + Info */}
                      <div className="flex justify-between items-center md:items-center gap-6 w-full md:w-1/3">
                        <img
                          src={order.products[0].coverimage}
                          alt={order.itemname}
                          className="w-20 h-20 object-cover rounded-md md:border"
                        />
                        <div className="flex flex-col gap-2">
                          {/* <p className="font-semibold text-gray-800">
                      Order No: {order._id}
                    </p> */}
                          {/* <p className="flex text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleString()}
                    </p> */}
                          {/* <p className="text-gray-600 text-sm truncate max-w-xs">
                      Address: {order.delivery_address || "N/A"}
                    </p> */}
                          <p className="font-semibold text-gray-800">
                            <span className="text-sm md:text-lg">
                              Product Name
                            </span>
                          </p>
                          <p className="flex gap-2 tracking-wider font-medium text-gray-700">
                            {" "}
                            <span className="text-black text-md md:text-lg tracking-wider">
                              ₹{order.finalOrderTotal || 0}
                            </span>
                          </p>
                        </div>
                        <div className="flex">
                          {/* Mobile buttons at right side */}
                          <div className=" md:hidden flex gap-2">
                            {/* Expand More Button */}
                            <button
                              onClick={() => downloadInvoice(order)}
                              className="p-1 rounded-full border border-green-300 hover:bg-green-50 transition"
                              title="Download Invoice"
                            >
                              <MdDownload className="text-xl text-green-500 hover:text-green-600 " />
                            </button>
                            <button
                              onClick={() => toggleMoreInfo(order._id)}
                              className="p-1 rounded-full border border-blue-300 hover:bg-blue-50 transition"
                              title="Toggle Details"
                            >
                              <MdExpandMore
                                className={`text-xl text-blue-500 transform transition-transform duration-300 ${
                                  expandedOrder === order._id
                                    ? "rotate-180"
                                    : "rotate-0"
                                }`}
                              />
                            </button>

                            {/* Cancel Button */}
                            {[
                              "Out for delivery",
                              "Delivered",
                              "Cancelled",
                            ].includes(order.orderStatus) ? null : (
                              <button
                                onClick={() => openMobileModal(order._id)}
                                className="p-1 rounded-full border border-red-300 hover:bg-red-50 transition"
                                title="Cancel Order"
                              >
                                <RxCross2 className="text-xl text-red-500 hover:text-red-600 transition-transform duration-300 hover:rotate-90" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {showCancelMobileModal && (
                        <div
                          className={`fixed inset-0 z-50 md:hidden transition-opacity duration-500 ease-in-out ${
                            open
                              ? "opacity-100 pointer-events-auto"
                              : "opacity-0 pointer-events-none"
                          }`}
                        >
                          {/* Background overlay with blur & transition */}
                          <div
                            onClick={closeMobileModel}
                            className={`absolute inset-0 bg-black transition-all duration-500 ease-in-out ${
                              open
                                ? "bg-opacity-15 "
                                : "bg-opacity-0 backdrop-blur-0"
                            }`}
                          ></div>

                          {/* Bottom sheet modal */}
                          <div
                            className={`fixed bottom-0 left-0 right-0 bg-white w-full max-w-md mx-auto rounded-t-2xl p-5 shadow-xl text-center transform transition-all duration-500 ease-in-out ${
                              animateModal
                                ? "translate-y-0 opacity-100"
                                : "translate-y-full opacity-0"
                            }`}
                          >
                            <h2 className="text-lg font-semibold text-gray-800 mb-2">
                              Cancel this order?
                            </h2>
                            <p className="text-sm text-gray-500 mb-6">
                              Are you sure you want to cancel this order? This
                              action can’t be undone.
                            </p>
                            <div className="flex flex-row gap-3">
                              <button
                                onClick={closeMobileModel}
                                className="py-2 w-full rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
                              >
                                No
                              </button>
                              <button
                                onClick={() => {
                                  handleCancelOrder(selectedOrderId);
                                  closeMobileModel();
                                }}
                                className="py-2 w-full rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
                              >
                                Yes, Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Right: Action Buttons */}
                      <div className="hidden md:block">
                        <div className="flex items-center gap-2 md:w-auto">
                          {/* Expand More Button */}
                          <button
                            onClick={() => downloadInvoice(order)}
                            className="p-2 rounded-full border border-green-300 hover:bg-green-50 transition"
                            title="Download Invoice"
                          >
                            <MdDownload className="text-2xl text-green-500 hover:text-green-600 " />
                          </button>
                          <button
                            onClick={() => toggleMoreInfo(order._id)}
                            className="p-2 rounded-full border border-blue-300 hover:bg-blue-50 transition"
                            title="Toggle Details"
                          >
                            <MdExpandMore
                              className={`text-2xl text-blue-500 transform transition-transform duration-300 ${
                                expandedOrder === order._id
                                  ? "rotate-180"
                                  : "rotate-0"
                              }`}
                            />
                          </button>

                          {/* Cancel Button */}
                          {[
                            "Out for delivery",
                            "Delivered",
                            "Cancelled",
                          ].includes(order.orderStatus) ? null : (
                            <>
                              <button
                                onClick={() => openModal(order._id)}
                                className="p-2 rounded-full border border-red-300 hover:bg-red-50 transition"
                                title="Cancel Order"
                              >
                                <RxCross2 className="text-2xl text-red-500 hover:text-red-600 transition-transform duration-300 hover:rotate-90" />
                              </button>
                              <button
                                onClick={() => openMobileModal(order._id)}
                                className="block md:hidden p-2 rounded-full border border-red-300 hover:bg-red-50 transition"
                                title="Cancel Order"
                              >
                                <RxCross2 className="text-2xl text-yellow-500 hover:text-red-600 transition-transform duration-300 hover:rotate-90" />
                              </button>
                            </>
                          )}

                          {showCancelModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 transition-opacity duration-300">
                              <div
                                className={`bg-white w-full max-w-md sm:rounded-2xl rounded-xl p-5 sm:p-6 shadow-xl text-center transform transition-all duration-300
                            ${
                              animateModal
                                ? "scale-100 opacity-100 translate-y-0"
                                : "scale-95 opacity-0 translate-y-4"
                            }`}
                              >
                                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                                  Cancel this order?
                                </h2>
                                <p className="text-sm text-gray-500 mb-6">
                                  Are you sure you want to cancel this order?
                                  This action can’t be undone.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <button
                                    onClick={closeModal}
                                    className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
                                  >
                                    No
                                  </button>
                                  <button
                                    onClick={() => {
                                      handleCancelOrder(selectedOrderId);
                                      closeModal();
                                    }}
                                    className="flex-1 py-2 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
                                  >
                                    Yes, Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="flex gap-2 items-center justify-between  font-semibold text-gray-500 text-xs md:text-sm">
                      <div className="flex gap-1 items-center">
                        {" "}
                        <MdAccessTime className="text-lg" />{" "}
                        {new Date(order.createdAt).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}{" "}
                        {"  "}
                      </div>
                      <div>
                        {"  "}
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                    </p>

                    {expandedOrder === order._id && (
                      <div className="mt-2 border-t pt-6 space-y-6">
                        {/* Order Items */}
                        <section className="space-y-4">
                          <h3 className="text-xl font-semibold text-gray-800 text-center md:text-left">
                            🛍️ Items in this Order
                          </h3>
                          <div className="max-h-[50vh] overflow-y-auto space-y-4">
                            {order.products?.length > 0 ? (
                              order.products.map((product, index) => (
                                <div
                                  key={index}
                                  className="flex flex-col md:flex-row items-center md:items-start gap-4 bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                                >
                                  <img
                                    src={product.coverimage}
                                    alt={product.itemname}
                                    className="w-24 h-24 object-cover rounded-lg "
                                  />
                                  <div className="flex-1 space-y-2 w-full">
                                    <p className="text-lg font-semibold text-gray-800 text-center md:text-left">
                                      {product.itemname}
                                    </p>
                                    <div className="gap-3">
                                      {product.variantPrices?.map(
                                        (variant, i) => {
                                          const discountAmount =
                                            (variant.price * variant.discount) /
                                            100;
                                          return (
                                            <div
                                              key={i}
                                              className=" w-full border p-3 rounded-lg space-y-2 text-sm text-gray-700"
                                            >
                                              <div className="flex justify-between">
                                                <span className="font-medium">
                                                  Weight:
                                                </span>
                                                <span>{variant.weight}g</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="font-medium">
                                                  Qty:
                                                </span>
                                                <span>{variant.quantity}</span>
                                              </div>
                                              <div className="flex justify-between">
                                                <span className="font-medium">
                                                  Price:
                                                </span>
                                                <span>₹{variant.price}</span>
                                              </div>
                                              <div className="flex justify-between text-green-600">
                                                <span className="font-medium">
                                                  Discount:
                                                </span>
                                                <span>
                                                  {variant.discount}% (₹
                                                  {discountAmount}
                                                  /item)
                                                </span>
                                              </div>
                                              <div className="flex justify-between text-red-500">
                                                <span className="font-medium">
                                                  GiftWrap:
                                                </span>
                                                <span>
                                                  ₹{variant.giftWrapCharge}
                                                </span>
                                              </div>
                                              {variant.giftNotes.map(
                                                (giftnote, idx) => (
                                                  <div
                                                    key={idx}
                                                    className="bg-yellow-50 border flex justify-between border-yellow-200 rounded-md p-2"
                                                  >
                                                    <span className="font-medium">
                                                      Gift Note:
                                                    </span>{" "}
                                                    "{giftnote}"
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-500 italic text-center">
                                No products in this order.
                              </p>
                            )}
                          </div>
                        </section>

                        {/* Billing Summary */}
                        <section className="bg-white border border-gray-200 rounded-xl p-5 shadow-md">
                          <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            💳 Billing Summary
                          </h3>
                          {(() => {
                            const totalOrderPrice = order.products?.reduce(
                              (acc, product) =>
                                acc +
                                product.variantPrices.reduce(
                                  (sum, variant) =>
                                    sum + variant.price * variant.quantity,
                                  0
                                ),
                              0
                            );

                            const totalDiscount = order.products?.reduce(
                              (acc, product) =>
                                acc +
                                product.variantPrices.reduce(
                                  (sum, variant) =>
                                    sum +
                                    ((variant.price * variant.discount) / 100) *
                                      variant.quantity,
                                  0
                                ),
                              0
                            );

                            const finalAmount =
                              (totalOrderPrice || 0) -
                              (totalDiscount || 0) -
                              (order.promocodeDiscount || 0) +
                              (order.delivery_charges || 0) +
                              (order.special_Gift_packing || 0);

                            return (
                              <div className="space-y-3 text-sm text-gray-700">
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    Total Price
                                  </span>
                                  <span>₹{totalOrderPrice || 0}</span>
                                </div>
                                <div className="flex justify-between text-red-600">
                                  <span className="font-medium">Discount</span>
                                  <span>-₹{totalDiscount || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    Delivery Charges
                                  </span>
                                  <span>₹{order.delivery_charges || 0}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    Gift Packaging
                                  </span>
                                  <span>
                                    ₹{order.special_Gift_packing || 0}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="font-medium">
                                    Promo Discount
                                  </span>
                                  <span>-₹{order.promocodeDiscount || 0}</span>
                                </div>
                                <div className="border-t pt-4 flex justify-between text-base font-bold text-gray-900">
                                  <span>Total Payable</span>
                                  <span>₹{finalAmount}</span>
                                </div>
                              </div>
                            );
                          })()}
                        </section>
                      </div>
                    )}
                  </div>
                </>
              ))
          )}
        </div>
      </div>
    </>
  );
};

export default MyOrders;
