// import React, { useEffect, useState } from "react";
// import Axios from "../utils/Axios";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import SummaryApi from "../common/SummaryApi";

// const MyDeliveries = () => {
//   const [orders, setOrders] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   // Define possible status options
//   const statusOptions = [
//     "Assigned",
//     "Out for Delivery",
//     "Delivered"
//   ];

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await Axios({
//           ...SummaryApi.getOrdersForDeliveryPartner,
//         });
//         const { data: responseData } = response;
//         if (responseData.success) {
//           setOrders(responseData.data);
//         } else {
//           setError(responseData.message);
//         }
//       } catch (err) {
//         setError('Error fetching orders');
//       }
//     };
//     fetchOrders();
//   }, []);

// const handleStatusUpdate = async (orderId, newStatus) => {
//   try {
//     setLoading(true);

//     const response = await Axios({
//       ...SummaryApi.updateOrderStatus,
//       data: { orderId, status: newStatus },
//     });

//     if (response.data.success) {
//       console.log("Order status updated successfully:", response.data);

//       // ✅ Update the local state immediately
//       setOrders((prevOrders) =>
//         prevOrders.map((order) =>
//           order.orderId === orderId
//             ? { ...order, orderStatus: newStatus } // Update status in UI
//             : order
//         )
//       );

//       setError(null);
//     } else {
//       console.error("Failed to update order status:", response.data.message);
//       setError(response.data.message);
//     }
//   } catch (error) {
//     console.error("Error updating order status:", error);
//     setError("Error updating delivery status");
//   } finally {
//     setLoading(false);
//   }
// };

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">My Deliveries</h2>
//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2">Order ID</th>
//               <th className="border p-2">Product</th>
//               <th className="border p-2">Payment Status</th>
//               <th className="border p-2">Total Amount</th>
//               <th className="border p-2">Delivery Address</th>
//               <th className="border p-2">Delivery Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {Array.isArray(orders) && orders.length > 0 ? (
//               orders.map((order) => (
//                 <tr key={order._id} className="text-center">
//                   <td className="border p-2">{order.orderId}</td>
//                   <td className="border p-2">{order.product_details.name}</td>
//                   <td className="border p-2">{order.payment_status || "Pending"}</td>
//                   <td className="border p-2">₹{order.totalAmt.toFixed(2)}</td>
//                   <td className="border p-2">{order.delivery_address || "Not Available"}</td>
//       <td className="border p-2">
//         <div className="flex items-center justify-center gap-2">
//           <select
//             className={`border rounded p-2 ${
//               loading ? 'opacity-50 cursor-not-allowed' : ''
//             } ${
//               order.orderStatus === 'Delivered'
//                 ? 'bg-green-50'
//                 : 'bg-white'
//             }`}
//             value={order.orderStatus || "Assigned"}
//             onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
//             disabled={loading || order.orderStatus === 'Delivered'}
//           >
//             {statusOptions.map((status) => (
//               <option
//                 key={status}
//                 value={status}
//                 disabled={
//                   order.orderStatus === 'Delivered' &&
//                   status !== 'Delivered'
//                 }
//               >
//                 {status}
//               </option>
//             ))}
//           </select>
//           {loading && (
//             <span className="text-sm text-gray-500">
//               Updating...
//             </span>
//           )}
//         </div>
//       </td>
//     </tr>
//   ))
// ) : (
//   <tr>
//     <td colSpan="6" className="border p-2 text-center">
//       No assigned deliveries
//     </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default MyDeliveries;

import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";
import '../assets/styles/receivepaymentmodel.css'

const MyDeliveries = ({ filterDelivered }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Modal visibility state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentOrderId, setPaymentOrderId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("CASH ON DELIVERY");
  console.log(`this is filterDelivered ${filterDelivered}`);
  // filter
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");


  const statusOptions = ["Assigned", "Out for Delivery", "Delivered"];
 
  useEffect(() => {
    let eventSource;
  
    if (!filterDelivered) {
      console.log("inside if event source", filterDelivered);
      eventSource = new EventSource("http://localhost:5000/events", {
        withCredentials: true,
      });
      console.log("filterDelivered", filterDelivered);
      console.log(eventSource);
      eventSource.onmessage = (event) => {
        var data = JSON.parse(event.data);
        
      
  
        if (data.isPreviousDeliveryPartner) {
          console.log("inside if ", data);
  
          // If the user is the previous delivery partner, remove the order
          setOrders((prevOrders) => {
            return prevOrders.filter((order) => order.orderId !== data.orderId);
          });
          console.log(
            `Order ${data.orderId} removed because user is the previous delivery partner`
          );
        } else {
          var data1 = data.updatedOrder;
  
          setOrders((prevOrders) => {
            // Check if the order already exists
            const orderExists = prevOrders.some(
              (order) => order.orderId === data1.orderId
            );
  
            if (orderExists) {
              // Update existing order
              return prevOrders.map((order) =>
                order.orderId === data1.orderId ? { ...order, ...data1 } : order
              );
            } else {
              // Add new order
              return [...prevOrders, data1];
            }
          });
        }
      };
    }
  
    const fetchOrders = async () => {
      try {
        let response;
        if (filterDelivered) {
          response = await Axios({ ...SummaryApi.getDeliveredOrder });
        } else {
          response = await Axios({ ...SummaryApi.getNotDeliveredOrder });
        }
        const { data: responseData } = response;
        if (responseData.success) {
          console.log(responseData.data);
          setOrders(responseData.data || []);
        } else {
          setError(responseData.message);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Error fetching orders");
      } 
    };
  
    fetchOrders();
  
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [filterDelivered]); // ✅ Dependency added
  
  // const handleStatusUpdate = async (orderId, newStatus) => {
  //   try {
  //     setLoading(true);

  //     const response = await Axios({
  //       ...SummaryApi.updateOrderStatus,
  //       data: { orderId, status: newStatus },
  //     });

  //     if (response.data.success) {
        
  //       if (response.data.paymentRequired) {
  //         console.log(response.data.paymentRequired);
          
  //         // If payment is required, open the payment modal
  //         openPaymentModal(orderId);
  //       } else {
  //         console.log("Order status updated successfully:", response.data);

  //         // ✅ Update the local state immediately
  //         setOrders((prevOrders) =>
  //           prevOrders.map((order) =>
  //             order.orderId === orderId
  //               ? { ...order, orderStatus: newStatus } // Update status in UI
  //               : order
  //           ).filter((order) => order.orderStatus !== "Delivered")
  //         );

  //         setError(null);
  //       }
  //     } else {
  //       console.error("Failed to update order status:", response.data.message);
  //       setError(response.data.message);
  //     }
  //   } catch (error) {
  //     // Log the full error for debugging
  //     console.error("Error updating order status:", error.response?.data || error.message);
      
  //     const errorData = error.response?.data;
    
  //     // Check if payment is required and trigger payment modal
  //     if (errorData?.paymentRequired) {
  //       setError(errorData.message); // Display the error message to the user
  //       openPaymentModal(orderId);   // Trigger payment modal for further action
  //     } else if (errorData?.message) {
  //       setError(errorData.message); // Show any other server error messages
  //     } else {
  //       setError("Error updating delivery status"); // Fallback error message
  //     }
  //   }
  //    finally {
  //     setLoading(false);
  //   }
  // };
  
  // Function to open payment modal
 
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setLoading(true);
  
      const response = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: { orderId, status: newStatus },
      });
  
      if (response.data.success) {
        console.log(response.data);
        if (response.data.paymentRequired) {
          console.log(response.data.paymentRequired);
          openPaymentModal(orderId); // ✅ Open modal if payment is required
        } else {
          console.log("Order status updated successfully:", response.data);
  
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.orderId === orderId
                ? { ...order, orderStatus: newStatus } 
                : order
            ).filter((order) => order.orderStatus !== "Delivered")
          );
  
          setError(null);
        }
      } else {
        console.error("Failed to update order status:", response.data.message);
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error.response?.data || error.message);
  
      const errorData = error.response?.data;
  
      // 🔥 **Fix:** Open payment modal when payment is required
      if (errorData?.paymentModalRequired) {
        setError(errorData.message); 
        openPaymentModal(orderId); // ✅ Open modal
      } else if (errorData?.message) {
        setError(errorData.message);
      } else {
        setError("Error updating delivery status");
      }
    } finally {
      setLoading(false);
    }
  };
  

  const openPaymentModal = (orderId) => {
    setPaymentOrderId(orderId);
    setShowPaymentModal(true);
  };
  
  // Function to handle payment status update in the modal
  // const handlePaymentStatusUpdate = async (orderId, paymentStatus) => {
  //   try {
  //     setLoading(true);
  //     console.log(paymentStatus);
      
  //     const response = await Axios({
  //       ...SummaryApi.updateOrderStatus,
  //       data: { orderId, status: "Delivered", paymentStatus: paymentStatus },
  //     });

  //     if (response.data.success) {
  //       // After payment is updated, update the order status to "Delivered"
  //       setOrders((prevOrders) =>
  //         prevOrders.map((order) =>
  //           order.orderId === orderId
  //             ? { ...order, orderStatus: "Delivered", payment_status: paymentStatus }
  //             : order
  //         )
  //       );

  //       // Close the payment modal after updating
  //       setShowPaymentModal(false);
  //       setError(null);
  //     } else {
  //       console.error("Failed to update payment status:", response.data.message);
  //       setError(response.data.message);
  //     }
  //   } catch (error) {
  //     console.error("Error updating payment status:", error);
  //     setError("Error updating payment status");
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handlePaymentStatusUpdate = async (orderId) => {
    try {
      setLoading(true);
      console.log("🔼 Sending request to update order:", { orderId, status: "Delivered", isPaymentDone: true });

      const response = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: { orderId, status: "Delivered", isPaymentDone: true }, // ✅ Sending isPaymentDone
      });

      if (response.data.success) {
        // ✅ Update UI state with isPaymentDone = true
        setOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId));

          console.log(orders)
        setShowPaymentModal(false);
        setError(null);
      } else {
        console.error("Failed to update payment status:", response.data.message);
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      setError("Error updating payment status");
    } finally {
      setLoading(false);
    }
  };

  // Handle status change for filter
const handleStatusFilterChange = (e) => {
  setSelectedStatus(e.target.value);
};

const handleDateFilterChange = (e) => {
  setSelectedDate(e.target.value);
};

// Filter orders based on selected status or date
const filteredOrders = orders.filter((order) => {
  if (!filterDelivered) {
    return selectedStatus ? order.orderStatus === selectedStatus : true;
  } else {
    return selectedDate
      ? new Date(order.orderDeliveredDatetime).toLocaleDateString("en-GB") ===
          new Date(selectedDate).toLocaleDateString("en-GB")
      : true;
  }
});
return (
  <div className="p-6">
    <h2 className="text-xl font-bold mb-4">
      {filterDelivered ? "Delivery History" : "My Deliveries"}
    </h2>

    {/* Filters */}
    {!filterDelivered && (
      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2 font-medium">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          value={selectedStatus}
          onChange={handleStatusFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="Assigned">Assigned</option>
          <option value="Out for Delivery">Out for Delivery</option>
        </select>
      </div>
    )}

    {filterDelivered && (
      <div className="mb-4">
        <label htmlFor="dateFilter" className="mr-2 font-medium">
          Filter by Date:
        </label>
        <input
          id="dateFilter"
          type="date"
          value={selectedDate}
          onChange={handleDateFilterChange}
          className="border p-2 rounded"
        />
      </div>
    )}

    <div className="overflow-x-auto">
      {/* <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Product</th>
            <th className="border p-2">Payment Status</th>
            <th className="border p-2">Total Amount</th>
            <th className="border p-2">Delivery Address</th>
            <th className="border p-2">Delivery Status</th>
            {filterDelivered ? (
              <>
                <th className="border p-2">Order Assigned Date</th>
                <th className="border p-2">Completion Date</th>
              </>
            ) : (
              <th className="border p-2">Order Assigned Date</th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <tr key={order._id} className="text-center">
                {console.log(order)}
                <td className="border p-2">{order.orderId}</td>
                <td className="border p-2">{order.product_details.name}</td>
                <td className="border p-2">
                  {order.payment_status || "Pending"}
                </td>
                <td className="border p-2">₹{order.totalAmt.toFixed(2)}</td>
                <td className="border p-2">
                  {order.delivery_address || "Not Available"}
                </td>
                <td className="border p-2">
                  <div className="flex items-center justify-center gap-2">
                    <select
                      className={`border rounded p-2 ${
                        order.orderStatus === "Delivered"
                          ? "bg-green-50"
                          : "bg-white"
                      }`}
                      value={order.orderStatus}
                      onChange={(e) => {
                        handleStatusUpdate(order.orderId, e.target.value);
                      }}
                      disabled={order.orderStatus === "Delivered"}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                {filterDelivered ? (
                  <>
                    <td className="border p-2">
                      {new Date(
                        order.orderAssignedDatetime
                      ).toLocaleDateString("en-GB")}
                    </td>
                    <td className="border p-2">
                      {new Date(
                        order.orderDeliveredDatetime
                      ).toLocaleDateString("en-GB")}
                    </td>
                  </>
                ) : (
                  <td className="border p-2">
                    {new Date(
                      order.orderAssignedDatetime
                    ).toLocaleDateString("en-GB")}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="border p-2 text-center">
                No assigned deliveries
              </td>
            </tr>
          )}
        </tbody>
      </table> */}
      <table className="w-full border-collapse border border-gray-300">
  <thead>
    <tr className="bg-gray-200">
      <th className="border p-2">Order ID</th>
      <th className="border p-2">Products</th>
      <th className="border p-2">Payment Status</th>
      <th className="border p-2">Total Amount</th>
      <th className="border p-2">Delivery Address</th>
      <th className="border p-2">Delivery Status</th>
      {filterDelivered ? (
        <>
          <th className="border p-2">Order Assigned Date</th>
          <th className="border p-2">Completion Date</th>
        </>
      ) : (
        <th className="border p-2">Order Assigned Date</th>
      )}
    </tr>
  </thead>
  <tbody>
    {filteredOrders.length > 0 ? (
      filteredOrders.map((order) => (
        <tr key={order._id} className="text-center">
          <td className="border p-2">{order.orderId}</td>
          <td className="border p-2">
            {order.products.map((product, index) => (
              <div key={index} className="text-left">
                <span className="font-semibold">{product.itemname}</span>
                <br />
                Variants: {product.variantPrices.map((v, i) => (
                  <span key={i}>
                    {v.weight} - ₹{v.price} ({v.quantity} pcs)
                    {i < product.variantPrices.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            ))}
          </td>
          <td className="border p-2">{order.payment_status || "Pending"}</td>
          <td className="border p-2">₹{order.finalOrderTotal || 0}</td>
          <td className="border p-2">
            {  console.log(order.delivery_address)}
            {order.delivery_address.address_line} ,
            {order.delivery_address.city},
            {order.delivery_address.state},
            {order.delivery_address.pincode}
          </td>
          <td className="border p-2">
            <div className="flex items-center justify-center gap-2">
              <select
                className={`border rounded p-2 ${
                  order.orderStatus === "Delivered" ? "bg-green-50" : "bg-white"
                }`}
                value={order.orderStatus}
                onChange={(e) => {
                  handleStatusUpdate(order.orderId, e.target.value);
                }}
                disabled={order.orderStatus === "Delivered"}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </td>
          {filterDelivered ? (
            <>
              <td className="border p-2">
                {order.orderAssignedDatetime
                  ? new Date(order.orderAssignedDatetime).toLocaleDateString("en-GB")
                  : "-"}
              </td>
              <td className="border p-2">
                {order.orderDeliveredDatetime
                  ? new Date(order.orderDeliveredDatetime).toLocaleDateString("en-GB")
                  : "-"}
              </td>
            </>
          ) : (
            <td className="border p-2">
              {order.orderAssignedDatetime
                ? new Date(order.orderAssignedDatetime).toLocaleDateString("en-GB")
                : "-"}
            </td>
          )}
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="8" className="border p-2 text-center">
          No assigned deliveries
        </td>
      </tr>
    )}
  </tbody>
</table>
</div>
{showPaymentModal && (
  <div className="modal">
    <div className="modal-content">
      <h3>Update Payment Status</h3>
      <div>
        <label>Payment Status:</label>
        <select 
          value={paymentStatus} 
          onChange={(e) => setPaymentStatus(e.target.value)}
        >
          <option value="">Select Status</option> {/* Default option */}
          <option value="Pending">Pending</option>
          <option value="Paid">Paid</option>
        </select>
      </div>
      
      {/* Disable button if no valid paymentStatus is selected */}
      <button 
        className="btnHandlePayment" 
        onClick={() => handlePaymentStatusUpdate(paymentOrderId, paymentStatus)}
        disabled={!paymentStatus} 
      >
        Update Payment Status
      </button>
      <br />
      <button 
        className="btnHandlePaymentClose" 
        onClick={() => setShowPaymentModal(false)}
      >
        Close
      </button>
    </div>
  </div>
)}
</div>

);
};

export default MyDeliveries;