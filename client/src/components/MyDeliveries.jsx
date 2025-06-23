import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common/SummaryApi";

const MyDeliveries = ({ filterDelivered }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // Modal visibility state
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentOrderId, setPaymentOrderId] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("Not Paid");
  const [otp, setOtp] = useState(""); // Stores the OTP entered by the user


  console.log(`this is filterDelivered ${filterDelivered}`);
  // filter
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCODStatus, setCODSelectedStatus] = useState("");

  
  const [selectedDate, setSelectedDate] = useState("");
  
  const statusOptions = ["Assigned", "Out for Delivery", "Delivered"];
 
  useEffect(() => {
    let eventSource;
  
    if (!filterDelivered) {
      console.log("inside if event source", filterDelivered);
      eventSource = new EventSource(
        `${import.meta.env.VITE_API_URL}/events`,
        { withCredentials: true }
      );
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

  // const handlePaymentStatusUpdate = async (orderId) => {
  //   try {
  //     setLoading(true);
  //     console.log("🔼 Sending request to update order:", { orderId, status: "Delivered", isPaymentDone: true });

  //     const response = await Axios({
  //       ...SummaryApi.updateOrderStatus,
  //       data: { orderId, status: "Delivered", isPaymentDone: true }, // ✅ Sending isPaymentDone
  //     });

  //     if (response.data.success) {
  //       // ✅ Update UI state with isPaymentDone = true
  //       setOrders((prevOrders) => prevOrders.filter((order) => order.orderId !== orderId));

  //         console.log(orders)
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

  // Handle status change for filter
const handleStatusFilterChange = (e) => {
  setSelectedStatus(e.target.value);
};

const handleCODStatusFilterChange = (e) => {
  setCODSelectedStatus(e.target.value);
};

const handleDateFilterChange = (e) => {
  setSelectedDate(e.target.value);
};
// Fetch Payment Received
// useEffect(() => {
//   const fetchPaymentReceived = async () => {
//     try {
//       const response = await Axios({ ...SummaryApi.getPaymentReceived });
//       if (response.data.success) {
//         setPaymentReceived(response.data.paymentReceived);
//         // console.log("Payment received:", response.data.paymentReceived);
        
//       }
//     } catch (error) {
//       console.error("Error fetching payment received:", error);
//     }
//   };

//   fetchPaymentReceived();
// }, []);

// Filter orders based on selected status or date
const filteredOrders = orders.filter ((order) => {
  if (!filterDelivered) {
    return selectedStatus ? order.orderStatus === selectedStatus : true;
  } else {
    if(selectedDate)
    {
      if ( new Date(order.orderDeliveredDatetime).toLocaleDateString("en-GB") === new Date(selectedDate).toLocaleDateString("en-GB"))
      {
        if(selectedCODStatus)
        {
          return order.cod_status === selectedCODStatus?true:false;
        }
        else
        {
          return true;
        }
      }
    }
    else if(selectedCODStatus)
    {
        return order.cod_status === selectedCODStatus?true:false;
    }
    else
    {
      return true;
    }
}
});
const handleVerifyOtp = async (orderId, otp) => {
  try {
    const response = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: { orderId, otpEntered: otp },
    });

      if (response.data.success) {
        alert("✅ OTP Verified! Payment updated & Order Delivered.");
        setShowPaymentModal(false);
        setPaymentStatus("Paid"); // Update UI with new status
         setOrders((prevOrders) =>
            prevOrders.filter((order) => order.orderId !== orderId)
          );
        // fetchUpdatedOrderData(orderId); // Fetch latest order details if needed
    } else {
        alert("❌ Invalid OTP. Please try again.");
    }

} catch (error) {
    console.error("Error verifying OTP:", error);
    alert("❌ Something went wrong.");
}
};



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
        {/* Display Payment Received */}
        {/* <div className="mb-4">
          <h3 className="text-lg font-semibold">Total Payment Received: ₹{paymentReceived}</h3>
          {paymentReceived > 0 && (
            <button 
              className="mt-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Submit Payment to Admin
            </button>
          )}
        </div> */}

          <div>
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
        <div className="mb-4">
          <label htmlFor="statusFilter" className="mr-2 font-medium">
            Filter by COD Status:
          </label>
          <select
            id="statusFilter"
            value={selectedCODStatus}
            onChange={handleCODStatusFilterChange}
            className="border p-2 rounded"
          >
            <option value="">All</option>
            <option value="NOT COMPLETED">NOT COMPLETED</option>
            <option value="PENDING">PENDING</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>
        </div>
      </div>
      
    )}

    <div className="overflow-x-auto">
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
          <th className="border p-2">COD Status</th>
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
            {order.delivery_address.address_line1} ,
            {order.delivery_address.address_line2} ,
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
              <td className="border p-2">{order.cod_status}</td>

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
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 className="text-xl font-bold text-center mb-4">Enter OTP to Confirm Payment</h3>
     
      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">Order ID:</label>
        <p className="text-gray-900">{paymentOrderId}</p>
      </div>
     
      <div className="mb-4">
        <label className="block font-medium text-gray-700 mb-1">Order Status:</label>
        <p className="text-gray-900">{paymentStatus}</p>  
      </div>


      <div className="mb-4">
        <label htmlFor="otpInput" className="block font-medium text-gray-700 mb-1">Enter OTP:</label>
        <input
          id="otpInput"
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength="6"
          placeholder="Enter 6-digit OTP"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>


      <div className="flex justify-center space-x-4 mt-6">
        <button
          className={`px-4 py-2 rounded-md text-white ${otp.length !== 6 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
          onClick={() => handleVerifyOtp(paymentOrderId, otp)}
          disabled={otp.length !== 6}
        >
          Verify OTP
        </button>
       
        <button
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          onClick={() => {
            setShowPaymentModal(false);
            setOtp("");
          }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


</div>

);
};

export default MyDeliveries;