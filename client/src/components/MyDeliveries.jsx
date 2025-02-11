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

const MyDeliveries = ({ filterDelivered = false }) => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const statusOptions = ["Assigned", "Out for Delivery", "Delivered"];

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:5000/events",{ withCredentials: true });
      console.log('event',eventSource);
      eventSource.onmessage = (event) => {
        
        var data = JSON.parse(event.data);
        console.log("Order update received:", data);
           console.log(data.orderId);
           console.log('this is data',data);
           
           if (data.isPreviousDeliveryPartner) {
            console.log('inside if ',data);

             // If the user is the previous delivery partner, remove the order
             setOrders((prevOrders) => {
               return prevOrders.filter((order) => order.orderId !== data.orderId);
              });
              console.log(`Order ${data.orderId} removed because user is the previous delivery partner`);
            }
            else
            {
        var  data1 = data.updatedOrder;
        
        setOrders((prevOrders) => {
          // Check if the order already exists
          const orderExists = prevOrders.some((order) => order.orderId === data1.orderId);
    
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
    


    const fetchOrders = async () => {
      try {
        const response = await Axios({
          ...SummaryApi.getOrdersForDeliveryPartner,
        });
        const { data: responseData } = response;
        if (responseData.success) {
          let filteredOrders = responseData.data;

          // ✅ Filter delivered orders if filterDelivered is true
          if (filterDelivered) {
            filteredOrders = filteredOrders.filter(order => order.orderStatus === "Delivered");
          }
          setOrders(filteredOrders);
        } else {
          setError(responseData.message);
        }
      } catch (err) {
        setError("Error fetching orders");
      }
    };
    fetchOrders();
      console.log(orders);

  }, [filterDelivered]); // ✅ Dependency added
  const handleStatusUpdate = async (orderId, newStatus) => {    
    try {
      setLoading(true);
  
      const response = await Axios({
        ...SummaryApi.updateOrderStatus,
        data: { orderId, status: newStatus },
      });
  
      if (response.data.success) {
        console.log("Order status updated successfully:", response.data);
  
        // ✅ Update the local state immediately
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, orderStatus: newStatus } // Update status in UI
              : order
          )
        );
  
        setError(null);
      } else {
        console.error("Failed to update order status:", response.data.message);
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setError("Error updating delivery status");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">
        {filterDelivered ? "Delivery History" : "My Deliveries"}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Payment Status</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Delivery Address</th>
              <th className="border p-2">Delivery Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="border p-2">{order.orderId}</td>
                  <td className="border p-2">{order.product_details.name}</td>
                  <td className="border p-2">{order.payment_status || "Pending"}</td>
                  <td className="border p-2">₹{order.totalAmt.toFixed(2)}</td>
                  <td className="border p-2">{order.delivery_address || "Not Available"}</td>
                  {/* <td className="border p-2">{order.orderStatus}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border p-2 text-center">
                  {filterDelivered ? "No delivery history available" : "No assigned deliveries"}
                </td> */}
                <td className="border p-2">
                    <div className="flex items-center justify-center gap-2">
                      <select
                        className={`border rounded p-2 ${
                          loading ? 'opacity-50 cursor-not-allowed' : ''
                        } ${
                          order.orderStatus === 'Delivered' 
                            ? 'bg-green-50' 
                            : 'bg-white'
                        }`}
                        value={order.orderStatus || "Assigned"}
                        onChange={(e) => handleStatusUpdate(order.orderId, e.target.value)}
                        disabled={loading || order.orderStatus === 'Delivered'}
                      >
                        {statusOptions.map((status) => (
                          <option 
                            key={status} 
                            value={status}
                            disabled={
                              order.orderStatus === 'Delivered' && 
                              status !== 'Delivered'
                            }
                          >
                            {status}
                          </option>
                        ))}
                      </select>
                      {loading && (
                        <span className="text-sm text-gray-500">
                          Updating...
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="border p-2 text-center">
                  No assigned deliveries
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyDeliveries;
