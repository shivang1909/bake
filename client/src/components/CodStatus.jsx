import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import CODcalculation from '../utils/CODcalculation.js';


const CodStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
     const [totalPendingFromAdmin, setTotalPendingFromAdmin] = useState(0);
    const [totalFinalOrderTotal, setTotalFinalOrderTotal] = useState(0);
      const [selectedCODStatus, setCODSelectedStatus] = useState("");



  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await Axios(SummaryApi.getCODOrder);
        if (response.data.success) {
            
          setOrders(response.data.data);
          console.log(CODcalculation(response.data.data));
          
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

    fetchOrders();
  }, []);

  const handleCODStatusChange = async () => {
    try {
        const response = await Axios({ ...SummaryApi.updateCODStatus});

        if (response.data.success) {
          setTotalPendingFromAdmin(totalFinalOrderTotal);
          setTotalFinalOrderTotal(0);

          console.log("before ", orders);
          
          const updatedOrders = orders;
          updatedOrders.forEach((order) => {
            if (order.cod_status === "NOT COMPLETED") {
              order.cod_status = "PENDING";
            }
          })
          console.log("After ", updatedOrders);
          setOrders(updatedOrders);

        alert("COD Status Updated Successfully!");
      } else {
        alert("Failed to update COD Status");
      }
    } catch (error) {
      console.error("Error updating COD status:", error);
      alert("Failed to update COD Status");
    }
};

  

  // Filter orders based on selected status or date

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Cash on delivery Payment Status</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">
          Total Payment Received from Customer: ₹{totalFinalOrderTotal}
        </h3>
        <h3 className="text-lg font-semibold">
          Not Aproved Payment by Admin : ₹{totalPendingFromAdmin}
        </h3>
        {totalFinalOrderTotal > 0 && (
          <button onClick={handleCODStatusChange} className="mt-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition">
            Submit Payment to Admin
          </button>
        )}
      </div>

      <div>
        <div className="mb-4">
          <label htmlFor="statusFilter" className="mr-2 font-medium">
            Filter by COD Status:
          </label>
          <select
            id="statusFilter"
            value={selectedCODStatus}
            onChange={(e)=>{setCODSelectedStatus(e.target.value)}}
            className="border p-2 rounded"
          >
            <option value="">All</option>
            <option value="NOT COMPLETED">NOT COMPLETED</option>
            <option value="PENDING">PENDING</option>
          </select>
        </div>
      </div>

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Order ID</th>
            <th className="border p-2">Products</th>
            <th className="border p-2">Payment Status</th>
            <th className="border p-2">Total Amount</th>
            <th className="border p-2">Delivery Address</th>
            <th className="border p-2">Delivery Status</th>
            <th className="border p-2">COD Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.filter((order)=>(selectedCODStatus?order.cod_status===selectedCODStatus:true)).map((order) => (
              <tr key={order._id} className="text-center">
                <td className="border p-2">{order.orderId}</td>
                <td className="border p-2">
                  {order.products.map((product, index) => (
                    <div key={index} className="text-left">
                      <span className="font-semibold">{product.itemname}</span>
                    </div>
                  ))}
                </td>
                <td className="border p-2">
                  {order.payment_status || "Pending"}
                </td>
                <td className="border p-2">₹{order.finalOrderTotal || 0}</td>
                <td className="border p-2">
                  {order.delivery_address
                    ? `${order.delivery_address.address_line}, ${order.delivery_address.city}, ${order.delivery_address.state} - ${order.delivery_address.pincode}`
                    : "Not Available"}
                </td>
                <td className="border p-2">{order.orderStatus}</td>
                <td className="border p-2">{order.cod_status || "Pending"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="border p-2 text-center">
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CodStatus;
