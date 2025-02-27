
import React, { useState, useEffect } from 'react';
import Axios from '../utils/Axios';
import SummaryApi from "../common/SummaryApi";
import { getUsers } from '../services/UserService';
import CODcalculation from '../utils/CODcalculation.js';
const AdminCodStatus = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  
  // State for filters
  const [filterPartner, setFilterPartner] = useState('');

   const [totalPendingFromAdmin, setTotalPendingFromAdmin] = useState(0);
  const [totalFinalOrderTotal, setTotalFinalOrderTotal] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await Axios(SummaryApi.getCODOrder);
        if (response.data.success) {
            
          setOrders(response.data.data);
          const calcValues = CODcalculation(response.data.data);
          
          setTotalPendingFromAdmin(calcValues.pendingAmount);
          setTotalFinalOrderTotal(calcValues.notSubmmited);
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
    
        fetchDeliveryPartners();
        fetchOrders();

  }, []);

    const handlePartner = (partnerId) => {
        setFilterPartner(partnerId);
        const filteredOrders = orders.filter((order) => (partnerId?order.deliveryPartnerId._id===partnerId:true));
        const calcValues = CODcalculation(filteredOrders);
        setTotalPendingFromAdmin(calcValues.pendingAmount);
        setTotalFinalOrderTotal(calcValues.notSubmmited);
    }


  const handleCODStatusChange = async () => {
    try {
      const response = await Axios({ ...SummaryApi.updateAdminCODStatus,
        data:{filterPartner}
      });

      if (response.data.success) {

          setTotalPendingFromAdmin(0);
          const updatedOrders = orders.filter((order) =>(order.cod_status==="PENDING"?false:true));
            setOrders(updatedOrders);
        alert("COD Status Updated Successfully!");
      } else {
        alert("Failed to update COD Status");
      }
    } catch (error) {
      console.error("Error updating COD status:", error);
      alert("Failed to update COD Status");
    }
  }


  if (loading) {
    return <div className="p-6 text-center">Loading orders...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">COD Admin Status Page</h2>

      {error && (
        <div className="mb-4 text-red-500">{error}</div>
      )}
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          Total Payment given by delivery partner: ₹{totalPendingFromAdmin}
        </h3>
        <h3 className="text-lg font-semibold">
          Not given Payment by delivery partner: ₹{totalFinalOrderTotal}
        </h3>
        <button onClick={handleCODStatusChange} className="mt-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition">
            Confirm Payment
          </button>
      </div>

      {/* Filters Section */}
      <div className="mb-4 flex gap-4">

        <div>
          <label className="block text-sm font-medium mb-1">Filter by Delivery Partner:</label>
          <select 
            value={filterPartner} 
            onChange={(e) => handlePartner(e.target.value)} 
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
        <th className="border p-2">Product(s)</th>
        <th className="border p-2">Payment Status</th>
        <th className="border p-2">Total Amount</th>
        <th className="border p-2">Delivery Address</th>
        <th className="border p-2">Order Status</th>
        <th className="border p-2">Delivery Partner</th>
        <th className="border p-2">Assigned Date</th>
        <th className="border p-2">Completion Date</th>
        <th className="border p-2">COD Status</th>
      </tr>
    </thead>
    <tbody>
      {orders.length > 0 ? (
        orders.filter((order)=>(filterPartner?order.deliveryPartnerId._id===filterPartner:true)).map((order) => (
          <tr key={order.orderId} className="text-center">
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
            <td className="border p-2">₹{order.finalOrderTotal.toFixed(2)}</td>

            {/* Handling delivery address correctly */}
            <td className="border p-2">
              {order.delivery_address
                ? `${order.delivery_address.address_line}, ${order.delivery_address.city}, ${order.delivery_address.state}, ${order.delivery_address.pincode}`
                : "Not Available"}
            </td>

            <td className="border p-2">{order.orderStatus || "Not Available"}</td>

            {/* Fetching Delivery Partner Name */}
            <td className="border p-2">{order.deliveryPartnerId.name}</td>

            <td className="border p-2">
              {order.orderAssignedDatetime
                ? new Date(order.orderAssignedDatetime).toLocaleDateString('en-GB')
                : "Not Assigned"}
            </td>

            <td className="border p-2">
              {order.orderDeliveredDatetime
                ? new Date(order.orderDeliveredDatetime).toLocaleDateString('en-GB')
                : "Not Delivered"}
            </td>
            <td className="border p-2">{order.cod_status}</td>

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

export default AdminCodStatus;
