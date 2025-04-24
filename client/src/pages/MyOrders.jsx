import React, { useState, useEffect } from "react";
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'

const MyOrders = () => {
  const [orders, setOrders] = useState([]); // Ensuring orders is always an array
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await Axios({
          method: SummaryApi.getMyorderItems.method, // Dynamic method (GET)
          url: SummaryApi.getMyorderItems.url,      // Dynamic URL
        });

        const data = Array.isArray(response.data) ? response.data : []; // Ensure response is an array
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]); // Set to empty array on error
      }
    };

    fetchOrders();
  }, []);
  const handleCancelOrder = async (orderId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;
  
    try {
      const response = await Axios({
        method: SummaryApi.CancelOrder.method,
        url: SummaryApi.CancelOrder.url(orderId), // dynamic URL
      });
  
      alert("Order cancelled successfully!");
  
      // Optional: Refresh or update order status in UI
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: "Cancelled" } : order
        )
      );
    } catch (error) {
      console.error("Cancel error:", error);
      alert("Failed to cancel order");
    }
  };
  

  const toggleMoreInfo = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white shadow-md p-4 rounded-md font-semibold mb-4">
        <h1 className="text-lg">My Orders</h1>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white shadow-md p-4 rounded-md text-center">
          {console.log(orders)
          }
          <p>No Orders Available</p>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white shadow-md p-4 rounded-md mb-4 border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-800">Order No: {order._id}</p>
                <p className="text-gray-600 text-sm">Order Date: {new Date(order.createdAt).toLocaleString()}</p>
                <p className="text-gray-600 text-sm">Address: {order.delivery_address || "N/A"}</p>
              
              </div>
              <p className="font-medium text-gray-700">Total: ₹{order.finalOrderTotal || 0}</p>
              <p className="font-medium text-gray-700">Order Status: {order.orderStatus === "Assigned" || order.orderStatus ===  "Not Assigned" ? "Order Placed" : order.orderStatus}</p>
            
              {order.orderStatus !== "Out for delivery" && order.orderStatus !== "Delivered" && order.orderStatus !== "Cancelled" && (
                <button
                  onClick={() => handleCancelOrder(order._id)}
                  className="bg-red-600 text-white px-4 py-1 rounded-md hover:bg-red-700 ml-2"
                >
                  Cancel Order
                </button>
              )}
              {/* <p className="font-medium text-gray-700">Order Status: {order.orderStatus === "Assigned" && "Not Assigned" ? "Order Placed" : order.orderStatus}</p> */}

              {/* {order.orderStatus= order.orderStatus === "Assigned" && "NOt Assigned" ? "Order Placed": order.orderStatus}
              <p className="font-medium text-gray-700">Order Status: {order.orderStatus}</p> */}
              <button
                onClick={() => toggleMoreInfo(order._id)}
                className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
              >
                {expandedOrder === order._id ? "Hide Info" : "Click for More Info"}
              </button>
            </div>

            {expandedOrder === order._id && (
              <div className="mt-4 border-t pt-4">
                <h2 className="font-bold text-lg mb-2">Order Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-bold text-md mb-2">Product Details</h3>
                    {order.products && order.products.length > 0 ? (
                      order.products.map((product, index) => (
                        <div key={index} className="flex items-center gap-4 border-t border-gray-200 pt-4 mt-4">
                          <img src={product.coverimage} alt={product.itemname} className="w-20 h-20 object-cover rounded-md border" />
                          <div>
                            <p className="font-bold">{product.itemname}</p>
                            {product.variantPrices?.map((variant, i) => {
                              const discountAmount = (variant.price * variant.discount) / 100; // Calculate discount in ₹
                              // const totalPrice = variant.price * variant.quantity; // Total before discount
                              // const finalPrice = totalPrice - discountAmount * variant.quantity; // Total after discount
                              return (
                                <div key={i}>
                                  <p><span className="font-medium">Weight:</span> {variant.weight}g</p>
                                  <p><span className="font-medium">Price:</span> ₹{variant.price}</p>
                                  <p><span className="font-medium">Discount:</span> {variant.discount}% (₹{discountAmount} per item)</p>
                                  <p><span className="font-medium">Quantity:</span> {variant.quantity}</p>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No products in this order.</p>
                    )}
                  </div>
                {/* Billing Summary */}
<div className="bg-gray-50 p-4 rounded-md">
  <h3 className="font-bold text-md mb-2">Billing Summary</h3>

  {/* Calculate Total Price Before Discount */}
  {(() => {
    const totalOrderPrice = order.products?.reduce((acc, product) => {
      return acc + product.variantPrices.reduce((sum, variant) => sum + (variant.price * variant.quantity), 0);
    }, 0);

    const totalDiscount = order.products?.reduce((acc, product) => {
      return acc + product.variantPrices.reduce((sum, variant) => sum + ((variant.price * variant.discount) / 100) * variant.quantity, 0);
    }, 0);

    return (
      <>
        <p className="font-medium">Total Price: ₹{totalOrderPrice || 0}</p>
        <p className="font-medium text-red-600">Discount: ₹{totalDiscount || 0}</p>
        <p className="font-medium">Delivery Charges: ₹{order.delivery_charges || 0}</p>
        <p className="font-medium">Gift Packaging: ₹{order.special_Gift_packing || 0}</p>
        <p className="font-bold mt-2 text-lg">
          Final Payable: ₹
          {(totalOrderPrice || 0) - (totalDiscount || 0) + (order.delivery_charges || 0) + (order.special_Gift_packing || 0)}
        </p>
      </>
    );
  })()}
</div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrders;
