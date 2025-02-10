// // import React, { useState, useEffect } from 'react';
// // import Axios from '../utils/Axios';
// // import { getUsers } from '../services/UserService';
// // import SummaryApi from "../common/SummaryApi";

// // const OrderListPage = () => {
// //   const [orders, setOrders] = useState([]);
// //   const [deliveryPartners, setDeliveryPartners] = useState([]);
// //   const [assignedPartners, setAssignedPartners] = useState({});
// //   const [error, setError] = useState(null);

// //   // Fetch delivery partners and orders
// //   useEffect(() => {
// //     const fetchUsers = async () => {
// //       try {
// //         const response = await getUsers();
// //         const deliveryPartnersData = response.filter((user) => user.role === "Delivery Partner");
// //         setDeliveryPartners(deliveryPartnersData);
// //       } catch (err) {
// //         setError('Error fetching users');
// //       }
// //     };
// //     fetchUsers();
// //   }, []);

// //   useEffect(() => {
// //     const getOrderItems = async () => {
// //       try {
// //         const response = await Axios(SummaryApi.getOrderItems);
// //         const { data: responseData } = response;

// //         if (responseData.success) {
// //           setOrders(responseData.data);
// //         }
// //       } catch (err) {
// //         setError('Error fetching orders');
// //       }
// //     };
// //     getOrderItems();
// //   }, []);

// //   useEffect(() => {
// //     if (orders.length > 0) {
// //       const initialAssignedPartners = {};
// //       orders.forEach((order) => {
// //         if (order.orderStatus === "Assigned" && order.deliveryPartnerId) {
// //           initialAssignedPartners[order.orderId] = {
// //             partnerId: order.deliveryPartnerId,
// //             isDisabled: true,
// //           };
// //         }
// //       });
// //       setAssignedPartners(initialAssignedPartners);
// //     }
// //   }, [orders]);

// //   const handleAssignPartner = async (orderId, partnerId) => {
// //     setAssignedPartners((prev) => ({
// //       ...prev,
// //       [orderId]: { partnerId, isDisabled: true },
// //     }));

// //     try {
// //       const response = await Axios.put('/api/order/assign-delivery-partner', {
// //         orderId,
// //         partnerId,
// //       });

// //       const { data: responseData } = response;

// //       if (responseData.success) {
// //         setOrders((prevOrders) =>
// //           prevOrders.map((order) =>
// //             order.orderId === orderId
// //               ? { ...order, deliveryPartnerId: partnerId }
// //               : order
// //           )
// //         );
// //       } else {
// //         setError('Failed to assign delivery partner');
// //       }
// //     } catch (err) {
// //       setError('Error assigning delivery partner');
// //     }
// //   };
// //   const handleEditPartner = (orderId) => {
// //     console.log('Editing partner for order:', orderId);
// //     setAssignedPartners((prev) => {
// //       const updated = { ...prev };
// //       updated[orderId] = { ...updated[orderId], isDisabled: false };  // Explicitly set isDisabled to false
// //       return updated;
// //     });
// //   };
  

// //   return (
// //     <div className="p-6">
// //       <h2 className="text-xl font-bold mb-4">All Orders</h2>
// //       {error && <p className="text-red-500 mb-4">{error}</p>}
// //       <div className="overflow-x-auto">
// //         <table className="w-full border-collapse border border-gray-300">
// //           <thead>
// //             <tr className="bg-gray-200">
// //               <th className="border p-2">Order ID</th>
// //               <th className="border p-2">Product</th>
// //               <th className="border p-2">Payment Status</th>
// //               <th className="border p-2">Total Amount</th>
// //               <th className="border p-2">Delivery Address</th>
// //               <th className="border p-2">Invoice</th>
// //               <th className="border p-2">Order Status</th>
// //               <th className="border p-2">Assign Delivery Partner</th>
// //             </tr>
// //           </thead>
// //           <tbody>
// //             {orders.length > 0 ? (
// //               orders.map((order) => (
// //                 <tr key={order.orderId} className="text-center">
// //                   <td className="border p-2">{order.orderId}</td>
// //                   <td className="border p-2">{order.product_details.name}</td>
// //                   <td className="border p-2">{order.payment_status || "Pending"}</td>
// //                   <td className="border p-2">₹{order.totalAmt.toFixed(2)}</td>
// //                   <td className="border p-2">{order.delivery_address || "Not Available"}</td>
// //                   <td className="border p-2">
// //                     {order.invoice_receipt ? (
// //                       <a href={order.invoice_receipt} target="_blank" rel="noopener noreferrer" className="text-blue-500">View</a>
// //                     ) : (
// //                       "Not Available"
// //                     )}
// //                   </td>
// //                   <td className="border p-2">{order.orderStatus || "Not Available"}</td>
// //                   <td className="border p-2 flex items-center gap-2">
// //                     {console.log(assignedPartners[order.orderId]?.isDisabled)// Add this log before the <select> tag
// //                     }
// //                {console.log('isDisabled for order:', order.orderId, assignedPartners[order.orderId]?.isDisabled)}
// // <select
// //   key={order.orderId}  // Force re-render on orderId change
// //   className="border p-1"
// //   value={assignedPartners[order.orderId]?.partnerId || (order.orderStatus === "Assigned" ? order.deliveryPartnerId : "")}
// //   onChange={(e) => handleAssignPartner(order.orderId, e.target.value)}
// //   disabled={assignedPartners[order.orderId]?.isDisabled || order.orderStatus === "Assigned"}
// // >
// //   <option value="">Select Partner</option>
// //   {deliveryPartners.map((partner) => (
// //     <option key={partner._id} value={partner._id}>
// //       {partner.name}
// //     </option>
// //   ))}
// // </select>

// //                     {assignedPartners[order.orderId]?.isDisabled && (
// //                     <button
// //                         className="bg-blue-500 text-white px-2 py-1 rounded"
// //                         onClick={() => handleEditPartner(order.orderId)}
// //                     >
// //                         Edit
// //                     </button>
// //                     )}

// //                   </td>
// //                 </tr>
// //               ))
// //             ) : (
// //               <tr>
// //                 <td colSpan="8" className="border p-2 text-center">No orders found</td>
// //               </tr>
// //             )}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default OrderListPage;

// import React, { useState, useEffect } from 'react';
// import Axios from '../utils/Axios';
// import { getUsers } from '../services/UserService';
// import SummaryApi from "../common/SummaryApi";

// const OrderListPage = () => {
//   const [orders, setOrders] = useState([]);
//   const [deliveryPartners, setDeliveryPartners] = useState([]);
//   const [assignedPartners, setAssignedPartners] = useState({});
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Rest of the useEffect hooks remain the same...
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await getUsers();
//         const deliveryPartnersData = response.filter(user => user.role === "Delivery Partner");
//         setDeliveryPartners(deliveryPartnersData);
//       } catch (err) {
//         setError('Error fetching delivery partners');
//       }
//     };
//     fetchUsers();
//   }, []);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await Axios(SummaryApi.getOrderItems);
//         if (response.data.success) {
//           setOrders(response.data.data);
//           initializeAssignedPartners(response.data.data);
//         }
//       } catch (err) {
//         setError('Error fetching orders');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, []);
//   // Initialize assigned partners state
//   const initializeAssignedPartners = (ordersData) => {
//     const initialAssignments = {};
//     ordersData.forEach(order => {
//       if (order.orderStatus === "Assigned" && order.deliveryPartnerId) {
//         initialAssignments[order.orderId] = {
//           partnerId: order.deliveryPartnerId,
//           isDisabled: true,
//           originalPartnerId: order.deliveryPartnerId // Store original partner ID
//         };
//       }
//     });
//     setAssignedPartners(initialAssignments);
//   };
//   const handleEditPartner = (orderId) => {
//     setAssignedPartners(prev => ({
//       ...prev,
//       [orderId]: {
//         ...prev[orderId],
//         isDisabled: false,
//         originalPartnerId: prev[orderId]?.partnerId // Store the current partner ID before editing
//       }
//     }));
//   };

// //   // Handle assigning/reassigning delivery partner
// //   const handleAssignPartner = async (orderId, partnerId) => {
// //     if (!partnerId) return; // Don't proceed if no partner is selected

// //     try {
// //       // Update UI optimistically
// //       setAssignedPartners(prev => ({
// //         ...prev,
// //         [orderId]: {
// //           partnerId,
// //           isDisabled: true
// //         }
// //       }));

// //       // Make API call
// //       const response = await Axios.put('/api/order/assign-delivery-partner', {
// //         orderId,
// //         partnerId,
// //       });

// //       if (response.data.success) {
// //         // Update orders state
// //         setOrders(prev => 
// //           prev.map(order => 
// //             order.orderId === orderId 
// //               ? { ...order, deliveryPartnerId: partnerId, orderStatus: "Assigned" }
// //               : order
// //           )
// //         );
// //         setError(null);
// //       } else {
// //         throw new Error('Failed to assign delivery partner');
// //       }
// //     } catch (err) {
// //       // Revert UI changes on error
// //       setAssignedPartners(prev => ({
// //         ...prev,
// //         [orderId]: {
// //           ...prev[orderId],
// //           isDisabled: true
// //         }
// //       }));
// //       setError('Error assigning delivery partner');
// //     }
// //   };

// const handleAssignPartner = async (orderId, partnerId) => {
//     if (!partnerId) return;

//     try {
//       setAssignedPartners(prev => ({
//         ...prev,
//         [orderId]: {
//           partnerId,
//           isDisabled: true,
//           originalPartnerId: partnerId
//         }
//       }));

//       const response = await Axios.put('/api/order/assign-delivery-partner', {
//         orderId,
//         partnerId,
//       });

//       if (response.data.success) {
//         setOrders(prev => 
//           prev.map(order => 
//             order.orderId === orderId 
//               ? { ...order, deliveryPartnerId: partnerId, orderStatus: "Assigned" }
//               : order
//           )
//         );
//         setError(null);
//       } else {
//         throw new Error('Failed to assign delivery partner');
//       }
//     } catch (err) {
//       setAssignedPartners(prev => ({
//         ...prev,
//         [orderId]: {
//           ...prev[orderId],
//           partnerId: prev[orderId]?.originalPartnerId,
//           isDisabled: true
//         }
//       }));
//       setError('Error assigning delivery partner');
//     }
//   };
  // const handleCancelEdit = (orderId) => {
  //   setAssignedPartners(prev => ({
  //     ...prev,
  //     [orderId]: {
  //       ...prev[orderId],
  //       isDisabled: true,
  //       partnerId: prev[orderId]?.originalPartnerId // Restore the original partner ID
  //     }
  //   }));
  // };

// if (loading) {
//     return (
//       <div className="p-6">
//         <div className="text-center">Loading orders...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">All Orders</h2>
      
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
//               <th className="border p-2">Invoice</th>
//               <th className="border p-2">Order Status</th>
//               <th className="border p-2">Assign Delivery Partner</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.length > 0 ? (
//               orders.map((order) => (
//                 <tr key={order.orderId} className="text-center">
//                   <td className="border p-2">{order.orderId}</td>
//                   <td className="border p-2">{order.product_details.name}</td>
//                   <td className="border p-2">{order.payment_status || "Pending"}</td>
//                   <td className="border p-2">₹{order.totalAmt.toFixed(2)}</td>
//                   <td className="border p-2">{order.delivery_address || "Not Available"}</td>
//                   <td className="border p-2">
//                     {order.invoice_receipt ? (
//                       <a 
//                         href={order.invoice_receipt} 
//                         target="_blank" 
//                         rel="noopener noreferrer" 
//                         className="text-blue-500 hover:text-blue-700"
//                       >
//                         View
//                       </a>
//                     ) : (
//                       "Not Available"
//                     )}
//                   </td>
//                   <td className="border p-2">{order.orderStatus || "Not Available"}</td>
//                   <td className="border p-2">
//                     <div className="flex items-center justify-center gap-2">
//                       <select
//                         className={`border rounded p-1 ${
//                           assignedPartners[order.orderId]?.isDisabled 
//                             ? 'bg-gray-100' 
//                             : 'bg-white'
//                         }`}
//                         value={
//                           assignedPartners[order.orderId]?.partnerId || 
//                           (order.orderStatus === "Assigned" ? order.deliveryPartnerId : "")
//                         }
//                         onChange={(e) => handleAssignPartner(order.orderId, e.target.value)}
//                         disabled={
//                           assignedPartners[order.orderId]?.isDisabled || 
//                           order.orderStatus === "Completed"
//                         }
//                       >
//                         <option value="">Select Partner</option>
//                         {deliveryPartners.map((partner) => (
//                           <option key={partner._id} value={partner._id}>
//                             {partner.name}
//                           </option>
//                         ))}
//                       </select>

//                       {(assignedPartners[order.orderId]?.isDisabled && 
//                         order.orderStatus !== "Completed") && (
//                         <button
//                           className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
//                           onClick={() => handleEditPartner(order.orderId)}
//                         >
//                           Edit
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                   {/* <td className="border p-2">
//                     <div className="flex items-center justify-center gap-2">
//                       <select
//                         className={`border rounded p-1 ${
//                           assignedPartners[order.orderId]?.isDisabled 
//                             ? 'bg-gray-100' 
//                             : 'bg-white'
//                         }`}
//                         value={
//                           assignedPartners[order.orderId]?.partnerId || 
//                           (order.orderStatus === "Assigned" ? order.deliveryPartnerId : "")
//                         }
//                         onChange={(e) => handleAssignPartner(order.orderId, e.target.value)}
//                         disabled={
//                           assignedPartners[order.orderId]?.isDisabled || 
//                           order.orderStatus === "Completed"
//                         }
//                       >
//                         <option value="">Select Partner</option>
//                         {deliveryPartners.map((partner) => (
//                           <option key={partner._id} value={partner._id}>
//                             {partner.name}
//                           </option>
//                         ))}
//                       </select>

//                       {assignedPartners[order.orderId]?.isDisabled ? (
//                         order.orderStatus !== "Completed" && (
//                           <button
//                             className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
//                             onClick={() => handleEditPartner(order.orderId)}
//                           >
//                             Edit
//                           </button>
//                         )
//                       ) : (
//                         <button
//                           className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded transition-colors"
//                           onClick={() => handleCancelEdit(order.orderId)}
//                         >
//                           Cancel
//                         </button>
//                       )}
//                     </div>
//                   </td> */}
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="border p-2 text-center">
//                   No orders found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default OrderListPage;


import React, { useState, useEffect } from 'react';
import Axios from '../utils/Axios';
import { getUsers } from '../services/UserService';
import SummaryApi from "../common/SummaryApi";

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [assignedPartners, setAssignedPartners] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        const deliveryPartnersData = response.filter(user => user.role === "Delivery Partner");
        setDeliveryPartners(deliveryPartnersData);
      } catch (err) {
        setError('Error fetching delivery partners');
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await Axios(SummaryApi.getOrderItems);
        if (response.data.success) {
          setOrders(response.data.data);
          initializeAssignedPartners(response.data.data);
        }
      } catch (err) {
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const initializeAssignedPartners = (ordersData) => {
    const initialAssignments = {};
    ordersData.forEach(order => {
      if (order.orderStatus === "Assigned" && order.deliveryPartnerId) {
        initialAssignments[order.orderId] = {
          partnerId: order.deliveryPartnerId,
          isDisabled: true,
          originalPartnerId: order.deliveryPartnerId
        };
      }
    });
    setAssignedPartners(initialAssignments);
  };

  const handleEditPartner = (orderId) => {
    setAssignedPartners(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        isDisabled: false,
        originalPartnerId: prev[orderId]?.partnerId
      }
    }));
  };

  const handleAssignPartner = async (orderId, partnerId) => {
    if (!partnerId) return;

    try {
      setAssignedPartners(prev => ({
        ...prev,
        [orderId]: {
          partnerId,
          isDisabled: true,
          originalPartnerId: partnerId
        }
      }));

      const response = await Axios.put('/api/order/assign-delivery-partner', {
        orderId,
        partnerId,
      });

      if (response.data.success) {
        setOrders(prev => 
          prev.map(order => 
            order.orderId === orderId 
              ? { ...order, deliveryPartnerId: partnerId, orderStatus: "Assigned" }
              : order
          )
        );
        setError(null);
      } else {
        throw new Error('Failed to assign delivery partner');
      }
    } catch (err) {
      setAssignedPartners(prev => ({
        ...prev,
        [orderId]: {
          ...prev[orderId],
          partnerId: prev[orderId]?.originalPartnerId,
          isDisabled: true
        }
      }));
      setError('Error assigning delivery partner');
    }
  };

  const handleCancelEdit = (orderId) => {
    setAssignedPartners(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        isDisabled: true,
        partnerId: prev[orderId]?.originalPartnerId
      }
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Orders</h2>

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
              <th className="border p-2">Invoice</th>
              <th className="border p-2">Order Status</th>
              <th className="border p-2">Assign Delivery Partner</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.orderId} className="text-center">
                  <td className="border p-2">{order.orderId}</td>
                  <td className="border p-2">{order.product_details.name}</td>
                  <td className="border p-2">{order.payment_status || "Pending"}</td>
                  <td className="border p-2">₹{order.totalAmt.toFixed(2)}</td>
                  <td className="border p-2">{order.delivery_address || "Not Available"}</td>
                  <td className="border p-2">
                    {order.invoice_receipt ? (
                      <a 
                        href={order.invoice_receipt} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-500 hover:text-blue-700"
                      >
                        View
                      </a>
                    ) : (
                      "Not Available"
                    )}
                  </td>
                  <td className="border p-2">{order.orderStatus || "Not Available"}</td>
                  <td className="border p-2">
                    <div className="flex items-center justify-center gap-2">
                      {order.orderStatus === "Delivered" ? (
                        <span className="text-green-600 font-bold">Order Completed</span>
                      ) : order.orderStatus === "Out for Delivery" ? (
                        <input 
                          type="text" 
                          value={
                            deliveryPartners.find(dp => dp._id === order.deliveryPartnerId)?.name || "Not Assigned"
                          }
                          disabled
                          className="border rounded p-1 bg-gray-100 text-center"
                        />
                      ) : (
                        <>
                          <select
                            className={`border rounded p-1 ${
                              assignedPartners[order.orderId]?.isDisabled 
                                ? 'bg-gray-100' 
                                : 'bg-white'
                            }`}
                            value={
                              assignedPartners[order.orderId]?.partnerId || 
                              (order.orderStatus === "Assigned" ? order.deliveryPartnerId : "")
                            }
                            onChange={(e) => handleAssignPartner(order.orderId, e.target.value)}
                            disabled={
                              assignedPartners[order.orderId]?.isDisabled || 
                              order.orderStatus === "Completed"
                            }
                          >
                            <option value="">Select Partner</option>
                            {deliveryPartners.map((partner) => (
                              <option key={partner._id} value={partner._id}>
                                {partner.name}
                              </option>
                            ))}
                          </select>

                           {/* Edit Button */}
                          {(assignedPartners[order.orderId]?.isDisabled && order.orderStatus !== "Completed" && order.orderStatus !== "Out for Delivery") && (
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                              onClick={() => handleEditPartner(order.orderId)}
                            >
                              Edit
                            </button>
                          )}

                          {/* Cancel Button */}
                          {assignedPartners[order.orderId]?.partnerId && assignedPartners[order.orderId]?.partnerId !== "" && !assignedPartners[order.orderId]?.isDisabled && order.orderStatus !== "Completed" && order.orderStatus !== "Out for Delivery" && (
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                              onClick={() => handleCancelEdit(order.orderId)}
                            >
                              Cancel
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="border p-2 text-center">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderListPage;
