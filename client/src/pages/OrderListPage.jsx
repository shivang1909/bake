import React, { useEffect, useState } from "react";
import Axios from '../utils/Axios';
import { getUsers } from '../services/UserService';

import SummaryApi from "../common/SummaryApi";
import { useSelector } from "react-redux";

const OrderListPage = () => {
    const [orders, setOrders] = useState([]);
    const [deliveryPartners, setDeliveryPartners] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
      useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await getUsers();
            console.log(response);
            const deliveryPartnersData = response.filter((user) => user.role === "Delivery Partner");

            // // Set filtered users to the state
            setDeliveryPartners(deliveryPartnersData);
            console.log(deliveryPartnersData);
            
            // setUsers(response);
          } catch (err) {
            setError('Error fetching users');
          }
        };
        fetchUsers();
      }, []);// Empty dependency array to fetch once when the component mounts
console.log(deliveryPartners);


  const getOrderItems = async () => {
    const response = await Axios({
        ...SummaryApi.getOrderItems
    })   
    const { data : responseData } = response;
    
    if(responseData.success){
        // console.log("Order fetched");
        setOrders(responseData.data)
    }
  };



  useEffect(() => {
    // Corrected syntax for setting the orders state
   getOrderItems()

  }, []);


//   useEffect(() => {
//     fetch("http://127.0.0.1:5000/api/users?role=delivery_partner") // Replace with your API endpoint
//       .then((response) => response.json())
//       .then((data) => setDeliveryPartners(data))
//       .catch((error) => console.error("Error fetching delivery partners:", error));
//   }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Orders</h2>
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
              <th className="border p-2">Assign Delivery Partner</th>
            </tr>
          </thead>
          <tbody>
            {/* Only map if orders is an array */}
            {Array.isArray(orders) && orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="text-center">
                  <td className="border p-2">{order.orderId}</td>
                  <td className="border p-2">
                    <div className="flex items-center justify-center">
                      <img src={order.product_details.image[0]} alt={order.product_details.name} className="w-12 h-12 mr-2" />
                      <span>{order.product_details.name}</span>
                    </div>
                  </td>
                  <td className="border p-2">{order.payment_status || "Pending"}</td>
                  <td className="border p-2">₹{order.totalAmt.toFixed(2)}</td>
                  <td className="border p-2">{order.delivery_address || "Not Available"}</td>
                  <td className="border p-2">
                    {order.invoice_receipt ? (
                      <a href={order.invoice_receipt} target="_blank" rel="noopener noreferrer" className="text-blue-500">View</a>
                    ) : (
                      "Not Available"
                    )}
                  </td>
                  <td className="border p-2">
                    <select className="border p-1">
                      <option value="">Select Partner</option>
                      {deliveryPartners.map((partner) => (
                        <option key={partner._id} value={partner._id}>{partner.name}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="border p-2 text-center">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderListPage;
