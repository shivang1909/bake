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
//     console.log("this is log ")
//     let eventSource;

//     try{

//        eventSource = new EventSource("http://localhost:5000/eventsadmin",{ withCredentials: true });
//     }
//     catch(error)
//     {
//       console.log(error);

//     }
//     eventSource.onmessage = (event) => {
//       console.log("i am inside on messagse event")
//       var data = JSON.parse(event.data);
//      console.log(data);
//      setOrders((prevOrders) => {
//       // Check if 'data' exists and is an object
//       if (!data || typeof data !== 'object') return prevOrders;
  
//       // Create a copy of the previous orders and find the matching order
//       const updatedOrders = prevOrders.map((order) =>
//           order.orderId === data.orderId ? { ...order, ...data } : order
//       );
  
//       // Return the updated orders array
//       return updatedOrders;
//   });
  
    
//     }
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
//   const handleCancelEdit = (orderId) => {
//     setAssignedPartners(prev => ({
//       ...prev,
//       [orderId]: {
//         ...prev[orderId],
//         isDisabled: true,
//         partnerId: prev[orderId]?.originalPartnerId // Restore the original partner ID
//       }
//     }));
//   };

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
//                       {order.orderStatus === "Delivered" ? (
//                         <span className="text-green-600 font-bold">Order Completed</span>
//                       ) : order.orderStatus === "Out for Delivery" ? (
//                         <input 
//                           type="text" 
//                           value={
//                             deliveryPartners.find(dp => dp._id === order.deliveryPartnerId)?.name || "Not Assigned"
//                           }
//                           disabled
//                           className="border rounded p-1 bg-gray-100 text-center"
//                         />
//                       ) : (
//                         <>
//                           <select
//                             className={`border rounded p-1 ${
//                               assignedPartners[order.orderId]?.isDisabled 
//                                 ? 'bg-gray-100' 
//                                 : 'bg-white'
//                             }`}
//                             value={
//                               assignedPartners[order.orderId]?.partnerId || 
//                               (order.orderStatus === "Assigned" ? order.deliveryPartnerId : "")
//                             }
//                             onChange={(e) => handleAssignPartner(order.orderId, e.target.value)}
//                             disabled={
//                               assignedPartners[order.orderId]?.isDisabled || 
//                               order.orderStatus === "Completed"
//                             }
//                           >
//                             <option value="">Select Partner</option>
//                             {deliveryPartners.map((partner) => (
//                               <option key={partner._id} value={partner._id}>
//                                 {partner.name}
//                               </option>
//                             ))}
//                           </select>

//                            {/* Edit Button */}
//                           {(assignedPartners[order.orderId]?.isDisabled && order.orderStatus !== "Completed" && order.orderStatus !== "Out for Delivery") && (
//                             <button
//                               className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
//                               onClick={() => handleEditPartner(order.orderId)}
//                             >
//                               Edit
//                             </button>
//                           )}

//                           {/* Cancel Button */}
//                           {assignedPartners[order.orderId]?.partnerId && assignedPartners[order.orderId]?.partnerId !== "" && !assignedPartners[order.orderId]?.isDisabled && order.orderStatus !== "Completed" && order.orderStatus !== "Out for Delivery" && (
//                             <button
//                               className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
//                               onClick={() => handleCancelEdit(order.orderId)}
//                             >
//                               Cancel
//                             </button>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </td>
                
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
  const [selectedOrders, setSelectedOrders] = useState({});
  const [bulkPartner, setBulkPartner] = useState("");
  const [selectedPartnerFilter, setSelectedPartnerFilter] = useState(""); // State for the filter
  const [orderStatusFilter, setOrderStatusFilter] = useState(""); // State for Order Status filter
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(""); // State for Payment Status filter


  useEffect(() => {
    let eventSource;
  
    // Set up the EventSource for real-time updates
    try {
      eventSource = new EventSource("http://localhost:5000/eventsadmin", { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
  
    // Handle incoming messages from the EventSource
  eventSource.onmessage = (event) => {
  console.log("i am inside on message event");
  var data = JSON.parse(event.data);
  console.log(data);

  // Only proceed if data is valid
  if (!data || typeof data !== 'object') return;

  // Filter out orders with status "Delivered" from the state
  if (data.orderStatus === "Delivered") {
    // If the order is marked as "Delivered", don't update the state with that order
    setOrders((prevOrders) => {
      return prevOrders.filter(order => order.orderId !== data.orderId);
    });
    return; // Exit after filtering out the "Delivered" status
  }

  setOrders((prevOrders) => {
    console.log("prevOrders", prevOrders);

    // If the new order status is "Out for delivery", we add/update it, excluding "Delivered" ones
    const updatedOrders = prevOrders.filter(order => order.orderId !== data.orderId); // Remove old order (if any)
    
    // Update state with the new order status, excluding "Delivered"
    const newOrders = [...updatedOrders, data];
    
    // Return the updated state
    return newOrders;
  });
};

  
    // Fetch users for delivery partners
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
  
    // Fetch orders and filter out "Delivered" and "Cancelled"
    const fetchOrders = async () => {
      try {
        const response = await Axios(SummaryApi.getOrderItems);
        if (response.data.success) {
          const filteredOrders = response.data.data.filter(order => 
            order.orderStatus !== "Delivered" && // Exclude delivered orders
            order.orderStatus !== "Cancelled"
          );
          setOrders(filteredOrders);
          initializeAssignedPartners(filteredOrders);
        }
      } catch (err) {
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrders();
  
    // Clean up the EventSource when the component is unmounted
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []); // Empty dependency array ensures this effect runs once after the initial render
  

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

  // New bulk assignment functions
  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const newSelection = {};
    orders.forEach(order => {
      if (order.orderStatus !== "Delivered" && order.orderStatus !== "Out for Delivery") {
        newSelection[order.orderId] = isChecked;
      }
    });
    setSelectedOrders(newSelection);
  };

  const handleBulkAssign = async () => {
    if (!bulkPartner) {
      setError('Please select a delivery partner');
      return;
    }

    const selectedOrderIds = Object.entries(selectedOrders)
      .filter(([_, isSelected]) => isSelected)
      .map(([orderId]) => orderId);

    if (selectedOrderIds.length === 0) {
      setError('Please select at least one order');
      return;
    }

    try {
      const response = await Axios.put('/api/order/bulk-assign-delivery-partner', {
        orderIds: selectedOrderIds,
        partnerId: bulkPartner,
      });

      if (response.data.success) {
        // Update orders state
        setOrders(prev => prev.map(order => 
          selectedOrderIds.includes(order.orderId)
            ? { ...order, deliveryPartnerId: bulkPartner, orderStatus: "Assigned" }
            : order
        ));

        // Update assigned partners state
        const newAssignments = {};
        selectedOrderIds.forEach(orderId => {
          newAssignments[orderId] = {
            partnerId: bulkPartner,
            isDisabled: true,
            originalPartnerId: bulkPartner
          };
        });
        setAssignedPartners(prev => ({
          ...prev,
          ...newAssignments
        }));

        // Clear selections
        setSelectedOrders({});
        setBulkPartner("");
        setError(null);
      } else {
        throw new Error('Failed to assign delivery partners');
      }
    } catch (err) {
      setError('Error assigning delivery partners');
    }
  };

    // Filter orders based on delivery partner, order status, and payment status
  const filteredOrders = orders.filter(order => {
    const matchesPartner = selectedPartnerFilter
      ? order.deliveryPartnerId === selectedPartnerFilter
      : true;
    const matchesStatus = orderStatusFilter
      ? order.orderStatus === orderStatusFilter
      : true;
    const matchesPaymentStatus = paymentStatusFilter
      ? order.payment_status === paymentStatusFilter
      : true;
    return matchesPartner && matchesStatus && matchesPaymentStatus;
  });

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

        {/* Bulk Assignment Controls */}
      <div className="mb-4 flex items-center gap-4">
        <select
          className="border rounded p-2"
          value={bulkPartner}
          onChange={(e) => setBulkPartner(e.target.value)}
          >
          <option value="">Select Partner for Bulk Assignment</option>
          {deliveryPartners.map((partner) => (
            <option key={partner._id} value={partner._id}>
              {partner.name}
            </option>
          ))}
        </select>
        <button
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          onClick={handleBulkAssign}
          >
          Assign to Selected Orders
        </button>
      
      </div>

      <div>
        <p>Filter:</p>
        {/* Filters Section */}
        <div className="mb-4 flex items-center gap-4">
              {/* Delivery Partner Filter */}
              <select
                className="border rounded p-2"
                value={selectedPartnerFilter}
                onChange={(e) => setSelectedPartnerFilter(e.target.value)}
              >
                <option value="">Select Delivery Partner</option>
                {deliveryPartners.map((partner) => (
                  <option key={partner._id} value={partner._id}>
                    {partner.name}
                  </option>
                ))}
              </select>

              {/* Order Status Filter */}
              <select
                className="border rounded p-2"
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
              >
                <option value="">Select Order Status</option>
                <option value="Not Assigned">Not Assigned</option>
                <option value="Assigned">Assigned</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>

              {/* Payment Status Filter */}
              <select
                className="border rounded p-2"
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
              >
                <option value="">Select Payment Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
        </div>
      {error && (
        <div className="mb-4 text-red-500">{error}</div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          {/* <thead>
            <tr className="bg-gray-200">
              {!filteredOrders.every(order => order.orderStatus === "Delivered" || order.orderStatus === "Out for Delivery") && (
                <th className="border p-2">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={Object.values(selectedOrders).length > 0 && Object.values(selectedOrders).every(Boolean)}
                  />
                </th>
              )}
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Payment Status</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Delivery Address</th>
              <th className="border p-2">Invoice</th>
              <th className="border p-2">Order Status</th>
              <th className="border p-2">Assigned Date</th>
              <th className="border p-2">Assign Delivery Partner</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.orderId} className="text-center">
                  {!filteredOrders.every(order => order.orderStatus === "Delivered" || order.orderStatus === "Out for Delivery") && (
                    <td className="border p-2">
                      {order.orderStatus !== "Delivered" && order.orderStatus !== "Out for Delivery" && (
                        <input
                          type="checkbox"
                          checked={selectedOrders[order.orderId] || false}
                          onChange={() => handleSelectOrder(order.orderId)}
                        />
                      )}
                    </td>
                  )}
                  {console.log(order)}
                  <td className="border p-2">{order.orderId}</td>
                  <td className="border p-2">{order.products.name}</td>
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
                    {order.orderAssignedDatetime ? new Date(order.orderAssignedDatetime).toLocaleDateString('en-GB') : "Not Available"}
                  </td>
                  <td className="border p-2">
                    <div className="flex items-center justify-center gap-2">
                      {order.orderStatus === "Delivered" ? (
                        <span className="text-green-600 font-bold">Order Completed</span>
                      ) : order.orderStatus === "Out for Delivery" ? (
                        <input 
                          type="text" 
                          value={deliveryPartners.find(dp => dp._id === order.deliveryPartnerId)?.name || "Not Assigned"}
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
                            value={assignedPartners[order.orderId]?.partnerId || (order.orderStatus === "Assigned" ? order.deliveryPartnerId : "")}
                            onChange={(e) => handleAssignPartner(order.orderId, e.target.value)}
                            disabled={assignedPartners[order.orderId]?.isDisabled || order.orderStatus === "Completed"}
                          >
                            <option value="">Select Partner</option>
                            {deliveryPartners.map((partner) => (
                              <option key={partner._id} value={partner._id}>
                                {partner.name}
                              </option>
                            ))}
                          </select>

                          {(assignedPartners[order.orderId]?.isDisabled && 
                            order.orderStatus !== "Completed" && 
                            order.orderStatus !== "Out for Delivery") && (
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                              onClick={() => handleEditPartner(order.orderId)}
                            >
                              Edit
                            </button>
                          )}
                          {assignedPartners[order.orderId]?.partnerId && 
                           assignedPartners[order.orderId]?.partnerId !== "" && 
                           !assignedPartners[order.orderId]?.isDisabled && 
                           order.orderStatus !== "Completed" && 
                           order.orderStatus !== "Out for Delivery" && (
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
                <td colSpan="9" className="border p-2 text-center">
                  No orders found
                </td>
              </tr>
            )}
          </tbody> */}
          <thead>
  <tr className="bg-gray-200">
    {!filteredOrders.every(order => order.orderStatus === "Delivered" || order.orderStatus === "Out for Delivery") && (
      <th className="border p-2">
        <input
          type="checkbox"
          onChange={handleSelectAll}
          checked={Object.values(selectedOrders).length > 0 && Object.values(selectedOrders).every(Boolean)}
        />
      </th>
    )}
    <th className="border p-2">Order ID</th>
    <th className="border p-2">Products</th>
    <th className="border p-2">Payment Status</th>
    <th className="border p-2">Total Amount</th>
    <th className="border p-2">Delivery Address</th>
    <th className="border p-2">Invoice</th>
    <th className="border p-2">Order Status</th>
    <th className="border p-2">Assigned Date</th>
    <th className="border p-2">Assign Delivery Partner</th>
  </tr>
</thead>
<tbody>
  {filteredOrders.length > 0 ? (
    filteredOrders.map((order) => (
      <tr key={order.orderId} className="text-center">
        {!filteredOrders.every(order => order.orderStatus === "Delivered" || order.orderStatus === "Out for Delivery") && (
          <td className="border p-2">
            {order.orderStatus !== "Delivered" && order.orderStatus !== "Out for Delivery" && (
              <input
                type="checkbox"
                checked={selectedOrders[order.orderId] || false}
                onChange={() => handleSelectOrder(order.orderId)}
              />
            )}
          </td>
        )}

        <td className="border p-2">{order.orderId}</td>

        {/* Products Column */}
        <td className="border p-2">
          {order.products.map((product, index) => (
            <div key={index} className="flex flex-col items-center">
              <img src={product.coverimage} alt={product.itemname} className="w-12 h-12 rounded" />
              <p>{product.itemname}</p>
            </div>
          ))}
        </td>

        <td className="border p-2">{order.payment_status || "Pending"}</td>
        <td className="border p-2">₹{order.finalOrderTotal || "N/A"}</td>

        {/* Delivery Address Column */}
        <td className="border p-2">
          {order.delivery_address ? (
            <>
              {order.delivery_address.address_line}, {order.delivery_address.city}, {order.delivery_address.state}, {order.delivery_address.pincode}
            </>
          ) : (
            "Not Available"
          )}
        </td>

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
          {order.orderAssignedDatetime ? new Date(order.orderAssignedDatetime).toLocaleDateString('en-GB') : "Not Available"}
        </td>

        {/* Assign Delivery Partner */}
        <td className="border p-2">
          <div className="flex items-center justify-center gap-2">
            {order.orderStatus === "Delivered" ? (
              <span className="text-green-600 font-bold">Order Completed</span>
            ) : order.orderStatus === "Out for Delivery" ? (
              <input 
                type="text" 
                value={deliveryPartners.find(dp => dp._id === order.deliveryPartnerId)?.name || "Not Assigned"}
                disabled
                className="border rounded p-1 bg-gray-100 text-center"
              />
            ) : (
              <>
                <select
                  className={`border rounded p-1 ${
                    assignedPartners[order.orderId]?.isDisabled ? 'bg-gray-100' : 'bg-white'
                  }`}
                  value={assignedPartners[order.orderId]?.partnerId || (order.orderStatus === "Assigned" ? order.deliveryPartnerId : "")}
                  onChange={(e) => handleAssignPartner(order.orderId, e.target.value)}
                  disabled={assignedPartners[order.orderId]?.isDisabled || order.orderStatus === "Completed"}
                >
                  <option value="">Select Partner</option>
                  {deliveryPartners.map((partner) => (
                    <option key={partner._id} value={partner._id}>
                      {partner.name}
                    </option>
                  ))}
                </select>

                {assignedPartners[order.orderId]?.isDisabled && 
                 order.orderStatus !== "Completed" && 
                 order.orderStatus !== "Out for Delivery" && (
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors"
                    onClick={() => handleEditPartner(order.orderId)}
                  >
                    Edit
                  </button>
                )}

                {assignedPartners[order.orderId]?.partnerId && 
                 assignedPartners[order.orderId]?.partnerId !== "" && 
                 !assignedPartners[order.orderId]?.isDisabled && 
                 order.orderStatus !== "Completed" && 
                 order.orderStatus !== "Out for Delivery" && (
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
      <td colSpan="9" className="border p-2 text-center">
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