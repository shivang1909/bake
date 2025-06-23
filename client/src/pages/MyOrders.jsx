import React, { useState, useEffect } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { MdDownload, MdExpandMore, MdAccessTime } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import NoOrder from "../../assets/images/Custom/basket.png";
import ProfileSideBar from "../components/ProfileSideBar";
import ContentLoader from "../components/ContentLoader";
import { FaArrowUp } from "react-icons/fa";




const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showCancelMobileModal, setShowCancelMobileModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const navigate = useNavigate();



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
    const fetchOrders = async () => {
      try {
        const response = await Axios({
          method: SummaryApi.getMyorderItems.method,
          url: SummaryApi.getMyorderItems.url,
        });
        setLoadingOrders(false);
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      }
    };
    fetchOrders();
  }, []);

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

  const toggleMoreInfo = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };


  const openModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
    setTimeout(() => setAnimateModal(true), 10);
  };




  const openMobileModal = (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelMobileModal(true);
    setTimeout(() => setAnimateModal(true), 10);
  };




  const closeModal = () => {
    setAnimateModal(false);
    setTimeout(() => setShowCancelModal(false), 300);
  };




  const closeMobileModel = () => {
    setAnimateModal(false);
    setTimeout(() => setShowCancelMobileModal(false), 300);
  };




  const handleCancelOrder = async (orderId) => {
    try {
      await Axios({
        method: SummaryApi.CancelOrder.method,
        url: SummaryApi.CancelOrder.url(orderId),
      });
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, orderStatus: "Cancelled" } : order
        )
      );
    } catch (error) {
      console.error("Cancel error:", error);
    }
  };




  const downloadInvoice = async (order) => {
    const res = await Axios({
      ...SummaryApi.getInvoice,
      data: { order },
      responseType: "blob",
    });
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
    window.URL.revokeObjectURL(url);
  };
 


 return (
    <>
    <div className="md:mt-20 lg:mt-20 lg:h-[100vh] flex flex-col md:flex-row gap-3 max-w-7xl mx-auto font-medium overflow-hidden">
      <ProfileSideBar activesection={"myorders"} />

      <div className="md:w-3/4 bg-white md:p-6 h-full min-h-[50vh] overflow-y-auto px-2 mt-12 md:mt-0">
       { orders.length === 0 && (
        <div className=" bg-white flex flex-col justify-center items-center rounded-xl p-8 text-center max-w-md mx-auto h-[85vh] lg:h-auto">
        <div className="flex justify-center pb-5">
          <img src={NoOrder} alt="No Orders" className="h-44 w-44 grayscale" />
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">No Orders Yet</h2>
        <p className="text-gray-600 mb-6">
          Looks like you haven't placed <br /> any orders yet.
        </p>
        <button
          onClick={() => navigate("/shopall")}
          className="bg-orange-500 w-full hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded-full transition duration-300"
        >
          Shop Now
        </button>
      </div>
)}

       {/* <div className="md:w-3/4 bg-white md:p-6 h-full min-h-[50vh] overflow-y-auto px-2 mt-12 md:mt-0"> */}
       {
         loadingOrders && (
             <ContentLoader />
         )
       }
       {orders.length > 0 &&
       <>
        <div className="text-xl font-semibold text-center w-full mb-4 mt-8 md:mt-0  ">My Orders</div>
        {orders.slice().reverse().map((order) => {
          const totalQuantity = order.products.reduce((acc, product) => {
            return acc + product.variantPrices.reduce((sum, variant) => sum + variant.quantity, 0);
          }, 0);




          const statusColor = {
            'Assigned': 'bg-green-100 text-green-800',
            'Not Assigned': 'bg-green-100 text-green-800',
            'Out for delivery': 'bg-blue-100 text-blue-800',
            'Delivered': 'bg-purple-100 text-purple-800',
            'Cancelled': 'bg-red-100 text-red-800'
          }[order.orderStatus] || 'bg-gray-100 text-gray-800';




          const statusText = ['Assigned', 'Not Assigned'].includes(order.orderStatus)
            ? 'Order Placed'
            : order.orderStatus;




          return (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 mb-4">
              {/* Header */}
                                      <div className="flex items-center p-3 justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
                          {statusText}
                        </span>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => downloadInvoice(order)}
                            className="p-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <MdDownload className="w-4 h-4" />
                          </button>


                          {!['Out for delivery', 'Delivered', 'Cancelled'].includes(order.orderStatus) && (
                            <button
                              onClick={() => window.innerWidth > 768 ? openModal(order._id) : openMobileModal(order._id)}
                              className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                            >
                              <RxCross2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
              <div className="px-6 pb-4">
                <div className="  mb-4">
                  <div className="flex items-center gap-4">
                   
                    <div className="w-24 h-16  rounded-xl flex items-center justify-center  overflow-hidden">
                      <img
                        src={order.products[0]?.coverimage}
                        alt={order.products[0]?.itemname}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="w-full">


                      <div className="text-[13px] font-bold text-gray-900">
                        Order ID: {order.orderId}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">


                        <div className="flex items-center gap-1 text-[13px]">
                          <span className="font-medium"> Payment:</span>
                          {order.payment_status.toLowerCase()
                            .split(' ')
                            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                            .join(' ')}
                        </div>
                      </div>
                    </div>
                  </div>


                  {/* Action Buttons */}


                </div>




                {/* Order Summary */}
                <div className="flex items-center justify-between bg-orange-50 rounded-xl p-4">
                  <div className="
                  flex gap-2 text-sm text-gray-900 font-semibold">
                    Total Products: <span className=" text-gray-900">{totalQuantity}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-[16px] font-bold text-gray-900">₹{order.finalOrderTotal || 0}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                  </div>
                </div>
              </div>




              {/* Expandable Content */}
              <div className="px-6">
                <button
                  onClick={() => toggleMoreInfo(order._id)}
                  className="flex items-center justify-between w-full py-3 text-left border-t border-gray-100"
                >
                  <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <span>🛍️ Items in this Order</span>
                  </div>
                  <MdExpandMore className={`w-5 h-5 text-gray-400 transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} />
                </button>
              </div>




              {expandedOrder === order._id && (
                <div className="px-6 pb-6 space-y-6">
                  {/* Items List */}
                  <div className="space-y-4">
                    {order.products?.length > 0 ? (
                      order.products.map((product, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4">
                          <div className="">
                            <div className="w-16 h-16 absolute  rounded-lg flex-shrink-0 overflow-hidden">
                              <img
                                src={product.coverimage}


                                alt={product.itemname}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="">


                              <h4 className="ml-20 font-semibold text-gray-900 mb-2 ">{product.itemname}</h4>
                              {product.variantPrices?.map((variant, i) => {
                                const discountAmount = (variant.price * variant.discount) / 100;
                                return (
                                  <div key={i} className="grid grid-cols-1  text-sm ">
                                    <div className="ml-20">
                                      <div className="flex flex-col ">
                                        <div>
                                          <div className="text-gray-600 flex gap-2">Weight: <span className="text-gray-900">{variant.weight}</span></div>
                                          <div className="text-gray-600 flex gap-2">Qty: <span className="text-gray-900">{variant.quantity}</span></div>
                                        </div>
                                        <div className="">
                                          <div className="text-gray-600 flex gap-2">Price: <span className="font-semibold text-gray-900">₹{variant.price}</span></div>


                                        </div>
                                      </div>
                                    </div>
                                    {variant.giftNotes.map((note, idx) => (
                                      <div key={idx} className="flex mt-4 bg-yellow-50 border border-yellow-200 rounded-md p-2 text-xs">
                                        <div className="font-medium whitespace-nowrap mr-2">Gift Note:</div>
                                        <div className="break-all">{note}</div>
                                      </div>


                                    ))}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic text-center">No products in this order.</p>
                    )}
                  </div>




                  {/* Billing Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <span>💳</span>
                      </div>
                      <h3 className="font-semibold text-gray-900">Billing Summary</h3>
                    </div>


                    <div className="space-y-3">
                      {(() => {
                        const totalOrderPrice = order.products?.reduce(
                          (acc, product) => acc + product.variantPrices.reduce(
                            (sum, variant) => sum + variant.price * variant.quantity, 0
                          ), 0
                        );




                        const totalDiscount = order.products?.reduce(
                          (acc, product) => acc + product.variantPrices.reduce(
                            (sum, variant) => sum + ((variant.price * variant.discount) / 100) * variant.quantity, 0
                          ), 0
                        );




                        const finalAmount = (totalOrderPrice || 0) - (totalDiscount || 0) -
                          (order.promocodeDiscount || 0) + (order.delivery_charges || 0) +
                          (order.special_Gift_packing || 0);




                        return (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Total Price</span>
                              <span className="font-medium">₹{totalOrderPrice || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Discount</span>
                              <span className="font-medium text-green-600">-₹{totalDiscount || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Delivery Charges</span>
                              <span className="font-medium">₹{order.delivery_charges || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Gift Packaging</span>
                              <span className="font-medium">₹{order.special_Gift_packing || 0}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Promo Discount</span>
                              <span className="font-medium text-green-600">-₹{order.promocodeDiscount || 0}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3">
                              <div className="flex justify-between text-lg font-bold">
                                <span className="text-gray-900">Total Payable</span>
                                <span className="text-blue-600">₹{finalAmount}</span>
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </>
      }




        {/* Cancel Order Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 transition-opacity duration-300">
            <div className={`bg-white w-full max-w-md sm:rounded-2xl rounded-xl p-5 sm:p-6 shadow-xl text-center transform transition-all duration-300
              ${animateModal ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'}`}
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Cancel this order?</h2>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to cancel this order? This action can't be undone.
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

        {/* Mobile Cancel Order Modal */}
        {showCancelMobileModal && (
          <div className={`fixed inset-0 z-50 md:hidden transition-opacity duration-500 ease-in-out ${showCancelMobileModal ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}>
            <div className={`absolute inset-0 bg-black transition-all duration-500 ease-in-out ${showCancelMobileModal ? 'bg-opacity-15' : 'bg-opacity-0 backdrop-blur-0'
              }`} onClick={closeMobileModel}></div>

            <div className={`fixed bottom-0 left-0 right-0 bg-white w-full max-w-md mx-auto rounded-t-2xl p-5 shadow-xl text-center transform transition-all duration-500 ease-in-out ${animateModal ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
              }`}>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Cancel this order?</h2>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to cancel this order? This action can't be undone.
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
      </div>
    </div>
    <button
                              onClick={scrollToTop}
                              className={`fixed bottom-5 right-5 z-40 w-[55px] h-[55px] rounded-full bg-gray-50/80 border border-gray-200 backdrop-blur-sm text-white p-3 shadow-inner transition-all duration-300 hover:bg-gray-100 hover:scale-110 active:scale-90 ${
                                showScrollTop ? "opacity-100 visible" : "opacity-0 invisible"
                              }`}
                            >
                              <FaArrowUp className="w-full h-full text-orange-500" />
                            </button>
    {/* </div> */}
    </>
  );
};




export default MyOrders;