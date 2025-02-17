// import React, { useState, useEffect } from 'react';
// import Axios from '../utils/Axios';
// import SummaryApi from "../common/SummaryApi";
// import { getUsers } from '../services/UserService';

// const OrderHistory = () => {
//   const [orders, setOrders] = useState([]);
//   const [deliveryPartners, setDeliveryPartners] = useState([]);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [filterPartner, setFilterPartner] = useState('');
//   const [sortOrder, setSortOrder] = useState('asc'); // Default sort order

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await Axios(SummaryApi.getOrderItems);
//         if (response.data.success) {
//           const filteredOrders = response.data.data.filter(order => 
//             order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"
//           );
//           setOrders(filteredOrders);
//         }
//       } catch (err) {
//         setError('Error fetching orders');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchDeliveryPartners = async () => {
//       try {
//         const response = await getUsers();
//         const partners = response.filter(user => user.role === "Delivery Partner");
//         setDeliveryPartners(partners);
//       } catch (err) {
//         setError('Error fetching delivery partners');
//       }
//     };

//     fetchOrders();
//     fetchDeliveryPartners();
//   }, []);

//   const getDeliveryPartnerName = (partnerId) => {
//     const partner = deliveryPartners.find(dp => dp._id === partnerId);
//     return partner ? `${partner.name}` : "Not Assigned";
//   };

//   // Filter orders by delivery partner
//   const filteredOrders = orders.filter(order => 
//     filterPartner ? order.deliveryPartnerId === filterPartner : true
//   );

//   // Sort orders by Completion Date
//   const sortedOrders = [...filteredOrders].sort((a, b) => {
//     const dateA = new Date(a.updatedAt);
//     const dateB = new Date(b.updatedAt);
//     return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
//   });

//   const handleSort = () => {
//     setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
//   };

//   if (loading) {
//     return <div className="p-6 text-center">Loading orders...</div>;
//   }

//   return (
//     <div className="p-6">
//       <h2 className="text-xl font-bold mb-4">Order History</h2>

//       {error && (
//         <div className="mb-4 text-red-500">{error}</div>
//       )}

//       {/* Filter Section */}
//       <div className="mb-4 flex gap-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Filter by Delivery Partner:</label>
//           <select 
//             value={filterPartner} 
//             onChange={(e) => setFilterPartner(e.target.value)} 
//             className="border p-2 rounded w-full"
//           >
//             <option value="">All</option>
//             {deliveryPartners.map(partner => (
//               <option key={partner._id} value={partner._id}>{partner.name}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse border border-gray-300">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="border p-2">Order ID</th>
//               <th className="border p-2">Product</th>
//               <th className="border p-2">Payment Status</th>
//               <th className="border p-2">Total Amount</th>
//               <th className="border p-2">Delivery Address</th>
//               <th className="border p-2">Order Status</th>
//               <th className="border p-2">Delivery Partner Name</th>
//               <th 
//                 className="border p-2 cursor-pointer" 
//                 onClick={handleSort}
//               >
//                 Completion Date {sortOrder === 'asc' ? '▲' : '▼'}
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {sortedOrders.length > 0 ? (
//               sortedOrders.map((order) => (
//                 <tr key={order.orderId} className="text-center">
//                   <td className="border p-2">{order.orderId}</td>
//                   <td className="border p-2">{order.product_details.name}</td>
//                   <td className="border p-2">{order.payment_status || "Pending"}</td>
//                   <td className="border p-2">₹{order.totalAmt.toFixed(2)}</td>
//                   <td className="border p-2">{order.delivery_address || "Not Available"}</td>
//                   <td className="border p-2">{order.orderStatus || "Not Available"}</td>
//                   <td className="border p-2">
//                     {getDeliveryPartnerName(order.deliveryPartnerId)}
//                   </td>
//                   <td className="border p-2">
//                     {new Date(order.updatedAt).toLocaleDateString('en-GB')}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="8" className="border p-2 text-center">
//                   No order history
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default OrderHistory;

import React, { useState, useEffect } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from "../common/SummaryApi";
import { getUsers } from '../services/UserService';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for filters
  const [filterDate, setFilterDate] = useState('');
  const [filterPartner, setFilterPartner] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await Axios(SummaryApi.getDeliveredOrder);
        if (response.data.success) {
          let filteredOrders = response.data.data.filter(order => 
            order.orderStatus === "Delivered" || order.orderStatus === "Cancelled"
          );
           filteredOrders = filteredOrders.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

          setOrders(filteredOrders);
        }
      } catch (err) {
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    const fetchDeliveryPartners = async () => {
      try {
        const response = await getUsers();
        const partners = response.filter(user => user.role === "Delivery Partner");
        setDeliveryPartners(partners);
      } catch (err) {
        setError('Error fetching delivery partners');
      }
    };

    fetchOrders();
    fetchDeliveryPartners();
  }, []);

  const getDeliveryPartnerName = (partnerId) => {
    const partner = deliveryPartners.find(dp => dp._id === partnerId);
    return partner ? `${partner.name}` : "Not Assigned";
  };

  // Filtered orders
  const filteredOrders = orders.filter(order => {
    const isPartnerMatch = filterPartner ? order.deliveryPartnerId === filterPartner : true;
    const isDateMatch = filterDate
      ? new Date(order.updatedAt).toISOString().slice(0, 10) === filterDate
      : true;
    return isPartnerMatch && isDateMatch;
  });

  if (loading) {
    return <div className="p-6 text-center">Loading orders...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Order History</h2>

      {error && (
        <div className="mb-4 text-red-500">{error}</div>
      )}

      {/* Filters Section */}
      <div className="mb-4 flex gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Filter by Date:</label>
          <input 
            type="date" 
            value={filterDate} 
            onChange={(e) => setFilterDate(e.target.value)} 
            className="border p-2 rounded w-full" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Filter by Delivery Partner:</label>
          <select 
            value={filterPartner} 
            onChange={(e) => setFilterPartner(e.target.value)} 
            className="border p-2 rounded w-full"
          >
            <option value="">All</option>
            {deliveryPartners.map(partner => (
              <option key={partner._id} value={partner._id}>{partner.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Product</th>
              <th className="border p-2">Payment Status</th>
              <th className="border p-2">Total Amount</th>
              <th className="border p-2">Delivery Address</th>
              <th className="border p-2">Order Status</th>
              <th className="border p-2">Delivery Partner Name</th>
              <th className="border p-2">Assigned Date</th>
              <th className="border p-2">Completion Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order.orderId} className="text-center">
                  <td className="border p-2">{order.orderId}</td>
                  <td className="border p-2">{order.product_details.name}</td>
                  <td className="border p-2">{order.payment_status || "Pending"}</td>
                  <td className="border p-2">₹{order.totalAmt.toFixed(2)}</td>
                  <td className="border p-2">{order.delivery_address || "Not Available"}</td>
                  <td className="border p-2">{order.orderStatus || "Not Available"}</td>
                  <td className="border p-2">
                    {getDeliveryPartnerName(order.deliveryPartnerId)}
                  </td>
                  <td className="border p-2">
                    {new Date(order.orderAssignedDatetime).toLocaleDateString('en-GB')}
                  </td>
                  <td className="border p-2">
                    {new Date(order.orderDeliveredDatetime).toLocaleDateString('en-GB')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="border p-2 text-center">
                  No order history
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderHistory;
