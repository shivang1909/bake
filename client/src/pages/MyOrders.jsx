// import React from 'react'
// import { useSelector } from 'react-redux'
// import NoData from '../components/NoData'

// const MyOrders = () => {
//   const orders = useSelector(state => state.orders.order)

//   console.log("order Items",orders)
//   return (
//     <div>
//       <div className='bg-white shadow-md p-3 font-semibold'>
//         <h1>Order</h1>
//       </div>
//         {
//           !orders[0] && (
//             <NoData/>
//           )
//         }
//         {
//           orders.map((order,index)=>{
//             return(
//               <div key={order._id+index+"order"} className='order rounded p-4 text-sm'>
//                   <p>Order No : {order?.orderId}</p>
//                   <div className='flex gap-3'>
//                     <img
//                       src={order.product_details.image[0]} 
//                       className='w-14 h-14'
//                     />  
//                     <p className='font-medium'>{order.product_details.name}</p>
//                   </div>
//               </div>
//             )
//           })
//         }
//     </div>
//   )
// }

// export default MyOrders


import React, { useState } from "react";

const staticOrders = [
  {
    orderId: "ORD-64c7636e3f93771b1c8454e1",
    orderDate: "2025-02-19",
    totalAmount: 365,
    address: "123 Street, City, State",
    paymentMethod: "CASH ON DELIVERY",
    totalPrice: 330,
    discount: 15,
    finalPayable: 315,
    packaging: 50,
    deliveryCharges: "Free",
    products: [
      {
        product_details: {
          name: "Product Name 1",
          image: "/images/product1.jpg"
        },
        variant: {
          weight: "250g",
          price: 105,
          cartQty: 1
        }
      },
      {
        product_details: {
          name: "Product Name 2",
          image: "/images/product2.jpg"
        },
        variant: {
          weight: "500g",
          price: 210,
          cartQty: 1
        }
      }
    ]
  },
  {
    orderId: "ORD-64c7636e3f93771b1c8454e2",
    orderDate: "2025-02-18",
    totalAmount: 150,
    address: "456 Another Street, Another City",
    paymentMethod: "ONLINE PAYMENT",
    totalPrice: 150,
    discount: 10,
    finalPayable: 140,
    packaging: 0,
    deliveryCharges: "Free",
    products: [
      {
        product_details: {
          name: "Product Name 3",
          image: "/images/product1.jpg"
        },
        variant: {
          weight: "1kg",
          price: 150,
          cartQty: 1
        }
      }
    ]
  },
  {
    orderId: "ORD-64c7636e3f93771b1c8454e3",
    orderDate: "2025-02-17",
    totalAmount: 720,
    address: "789 Some Avenue, City Center",
    paymentMethod: "CASH ON DELIVERY",
    totalPrice: 700,
    discount: 20,
    finalPayable: 700,
    packaging: 20,
    deliveryCharges: "Free",
    products: [
      {
        product_details: {
          name: "Product Name 4",
          image: "/images/product4.jpg"
        },
        variant: {
          weight: "500g",
          price: 200,
          cartQty: 2
        }
      },
      {
        product_details: {
          name: "Product Name 5",
          image: "/images/product5.jpg"
        },
        variant: {
          weight: "250g",
          price: 100,
          cartQty: 1
        }
      },
      {
        product_details: {
          name: "Product Name 6",
          image: "/images/product6.jpg"
        },
        variant: {
          weight: "750g",
          price: 150,
          cartQty: 1
        }
      }
    ]
  }
];


const MyOrders = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleMoreInfo = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white shadow-md p-4 rounded-md font-semibold mb-4">
        <h1 className="text-lg">My Orders</h1>
      </div>

      {staticOrders.length === 0 ? (
        <div className="bg-white shadow-md p-4 rounded-md">
          <p>No Orders Available</p>
        </div>
      ) : (
        staticOrders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white shadow-md p-4 rounded-md mb-4 border border-gray-200 hover:shadow-lg transition-all duration-300"
          >
            {/* Order Overview */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-800">Order No: {order.orderId}</p>
                <p className="text-gray-600 text-sm">Order Date: {order.orderDate}</p>
                <p className="text-gray-600 text-sm">Address: {order.address}</p>

              </div>
              
              <p className="font-medium text-gray-700">Payment Method {order.paymentMethod}</p>
              <p className="font-medium text-gray-700">Total: ₹{(order.totalPrice - order.discount)+ order.packaging}</p>
              <button
                onClick={() => toggleMoreInfo(order.orderId)}
                className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
              >
                {expandedOrder === order.orderId ? "Hide Info" : "Click to More Info"}
              </button>
            </div>

            {/* Expanded Section */}
            {expandedOrder === order.orderId && (
              <div className="mt-4 border-t pt-4">
                <h2 className="font-bold text-lg mb-2">Order Details</h2>

                {/* Address & Payment Info */}
                <div className="grid grid-cols-2 gap-4 mt-2 bg-gray-50 p-4 rounded-md">
                  <div>
                    <p className="font-medium">Address:</p>
                    <p className="text-gray-600">{order.address}</p>
                  </div>
                  <div>
                    <p className="font-medium">Payment Method:</p>
                    <p className="text-gray-600">{order.paymentMethod}</p>
                  </div>
                </div>
                <br />
                {/* Two-column layout for product info and bill info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Details Section */}
                  <div>
                    <h3 className="font-bold text-md mb-2">Product Details</h3>
                    {order.products.map((product, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 border-t border-gray-200 pt-4 mt-4"
                      >
                        <img
                          src={product.product_details.image}
                          alt={product.product_details.name}
                          className="w-20 h-20 object-cover rounded-md border"
                        />
                        <div>
                          <p className="font-bold">{product.product_details.name}</p>
                          <p>
                            <span className="font-medium">Weight:</span> {product.variant.weight}
                          </p>
                          <p>
                            <span className="font-medium">Price:</span> ₹{product.variant.price}
                          </p>
                          <p>
                            <span className="font-medium">Quantity:</span> {product.variant.cartQty}
                          </p>
                          <p>
                            <span className="font-medium">Total:</span> ₹
                            {product.variant.price * product.variant.cartQty}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bill Details Section */}
                  <div className="bg-gray-50 p-4 rounded-md">
                    <h3 className="font-bold text-md mb-2">Billing Summary</h3>
                    <p className="font-medium">Total Price: ₹{order.totalPrice}</p>
                    <p className="font-medium">Discount: ₹{order.discount}</p>
                    <p className="font-medium">Discounted Price: ₹{order.totalPrice - order.discount}</p>
                    <p className="font-medium">Packaging: ₹{order.packaging}</p>
                    <p className="font-medium">Delivery Charges: {order.deliveryCharges}</p>
                    <p className="font-bold mt-2 text-lg">Final Payable: ₹{(order.totalPrice - order.discount)+ order.packaging}</p>
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

