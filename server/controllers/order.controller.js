// import Stripe from "../config/stripe.js";
// import CartProductModel from "../models/cartproduct.model.js";
// import OrderModel from "../models/order.model.js";
// import UserModel from "../models/user.model.js";
// import mongoose from "mongoose";

//  export async function CashOnDeliveryOrderController(request,response){
//     try {
//         const userId = request.userId // auth middleware 
//         const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

//         const payload = list_items.map(el => {
//             return({
//                 userId : userId,
//                 orderId : `ORD-${new mongoose.Types.ObjectId()}`,
//                 productId : el.productId._id, 
//                 product_details : {
//                     name : el.productId.name,
//                     image : el.productId.image
//                 } ,
//                 paymentId : "",
//                 payment_status : "CASH ON DELIVERY",
//                 delivery_address : addressId ,
//                 subTotalAmt  : subTotalAmt,
//                 totalAmt  :  totalAmt,
//             })
//         })

//         const generatedOrder = await OrderModel.insertMany(payload)

//         ///remove from the cart
//         const removeCartItems = await CartProductModel.deleteMany({ userId : userId })
//         const updateInUser = await UserModel.updateOne({ _id : userId }, { shopping_cart : []})

//         return response.json({
//             message : "Order successfully",
//             error : false,
//             success : true,
//             data : generatedOrder
//         })

//     } catch (error) {
//         return response.status(500).json({
//             message : error.message || error ,
//             error : true,
//             success : false
//         })
//     }
// }

// export const pricewithDiscount = (price,dis = 1)=>{
//     const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
//     const actualPrice = Number(price) - Number(discountAmout)
//     return actualPrice
// }

// export async function paymentController(request,response){
//     try {
//         const userId = request.userId // auth middleware 
//         const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

//         const user = await UserModel.findById(userId)

//         const line_items  = list_items.map(item =>{
//             return{
//                price_data : {
//                     currency : 'inr',
//                     product_data : {
//                         name : item.productId.name,
//                         images : item.productId.image,
//                         metadata : {
//                             productId : item.productId._id
//                         }
//                     },
//                     unit_amount : pricewithDiscount(item.productId.price,item.productId.discount) * 100   
//                },
//                adjustable_quantity : {
//                     enabled : true,
//                     minimum : 1
//                },
//                quantity : item.quantity 
//             }
//         })

//         const params = {
//             submit_type : 'pay',
//             mode : 'payment',
//             payment_method_types : ['card'],
//             customer_email : user.email,
//             metadata : {
//                 userId : userId,
//                 addressId : addressId
//             },
//             line_items : line_items,
//             success_url : `${process.env.FRONTEND_URL}/success`,
//             cancel_url : `${process.env.FRONTEND_URL}/cancel`
//         }

//         const session = await Stripe.checkout.sessions.create(params)

//         return response.status(200).json(session)

//     } catch (error) {
//         return response.status(500).json({
//             message : error.message || error,
//             error : true,
//             success : false
//         })
//     }
// }


// const getOrderProductItems = async({
//     lineItems,
//     userId,
//     addressId,
//     paymentId,
//     payment_status,
//  })=>{
//     const productList = []

//     if(lineItems?.data?.length){
//         for(const item of lineItems.data){
//             const product = await Stripe.products.retrieve(item.price.product)

//             const paylod = {
//                 userId : userId,
//                 orderId : `ORD-${new mongoose.Types.ObjectId()}`,
//                 productId : product.metadata.productId, 
//                 product_details : {
//                     name : product.name,
//                     image : product.images
//                 } ,
//                 paymentId : paymentId,
//                 payment_status : payment_status,
//                 delivery_address : addressId,
//                 subTotalAmt  : Number(item.amount_total / 100),
//                 totalAmt  :  Number(item.amount_total / 100),
//             }

//             productList.push(paylod)
//         }
//     }

//     return productList
// }

// //http://localhost:8080/api/order/webhook
// export async function webhookStripe(request,response){
//     const event = request.body;
//     const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY

//     console.log("event",event)

//     // Handle the event
//   switch (event.type) {
//     case 'checkout.session.completed':
//       const session = event.data.object;
//       const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
//       const userId = session.metadata.userId
//       const orderProduct = await getOrderProductItems(
//         {
//             lineItems : lineItems,
//             userId : userId,
//             addressId : session.metadata.addressId,
//             paymentId  : session.payment_intent,
//             payment_status : session.payment_status,
//         })
    
//       const order = await OrderModel.insertMany(orderProduct)

//         console.log(order)
//         if(Boolean(order[0])){
//             const removeCartItems = await  UserModel.findByIdAndUpdate(userId,{
//                 shopping_cart : []
//             })
//             const removeCartProductDB = await CartProductModel.deleteMany({ userId : userId})
//         }
//       break;
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a response to acknowledge receipt of the event
//   response.json({received: true});
// }

// export async function getOrderDetailsController(request, response) {
//     try {
//         console.log("hello");
        
//         // Check if orders exist in the database
//         const orderList = await OrderModel.find().sort({ createdAt: -1 }).populate('delivery_address');
        
//         console.log("Fetched Orders:", orderList);  // Debugging log
        
//         if (!orderList || orderList.length === 0) {
//             return response.status(404).json({
//                 message: 'No orders found.',
//                 error: true,
//                 success: false,
//             });
//         }

//         return response.json({
//             message: 'Order list fetched successfully',
//             data: orderList,
//             error: false,
//             success: true,
//         });
//     } catch (error) {
//         console.error("Error fetching orders:", error);  // Debugging log
//         return response.status(500).json({
//             message: error.message || error,
//             error: true,
//             success: false,
//         });
//     }
// }

    
import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";

import AdminModel from '../models/admin.model.js'; // Assuming you have AdminModel which contains both Admin and Delivery Partner data
import mongoose from "mongoose";

// ssehandler function 
let clients = [];
let admin;
export function sseHandlerforadmin(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache'); 
    res.setHeader('Connection', 'keep-alive');

    console.log("admin calls this page ")

     admin =  { id: req.userId, res };
     console.log(admin.id);
     
    // Remove client when disconnected
    req.on('close', () => {
     
        console.log(`Client disconnected: `);
    });
}

export function sseHandler(req, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache'); 
    res.setHeader('Connection', 'keep-alive');

    console.log("admin calls this page ")
    const newClient = { id: req.userId, res };
    clients.push(newClient);

    console.log(`Client connected: ${newClient.id}`);

    // Remove client when disconnected
    req.on('close', () => {
        clients = clients.filter(client => client.id !== newClient);
        console.log(`Client disconnected: ${newClient}`);
    });
}

// Function to notify all connected clients
function notifyClients(Olddeliverypartner,data,isadmin) {
    console.log("this is data",data);

    if(isadmin)
    {
        admin.res.write(`data: ${JSON.stringify(data)}\n\n`);
        return;
    }
    clients.forEach(client => {
        // Send only to the assigned delivery partner
        console.log("--------");
        console.log("--------");
        console.log(client.id);
        console.log(data.updatedOrder.deliveryPartnerId);

        if (client.id === String(data.updatedOrder.deliveryPartnerId)) {
            client.res.write(`data: ${JSON.stringify(data)}\n\n`);
        }
        else if (client.id === Olddeliverypartner )
        {
            console.log("i am in else if ",Olddeliverypartner)
            client.res.write(`data: ${JSON.stringify({
                orderId: data.updatedOrder.orderId,
                isPreviousDeliveryPartner: true // Indicate that this is the previous delivery partner
            })}\n\n`);
        }
       
    });
}
async function  GetOlddeliverypartner(oid)
{   
    const record = await OrderModel.findOne({ orderId: oid }); // Correct query syntax
    if (!record) {
        throw new Error("Order not found");
    }
    return String(record.deliveryPartnerId); // Access document directly

}
/** Assign a Delivery Partner to an Order */
export async function assignDeliveryPartnerController(request, response) {
    try {
        // const { orderId, deliveryPartnerId } = request.body;
        const orderId =request.body.orderId;
        const deliveryPartnerId = request.body.partnerId;
        console.log(deliveryPartnerId);
        // console.log("this is is the order id",orderid);
         const preid =  await GetOlddeliverypartner(orderId);
        // Validate request
        if (!orderId || !deliveryPartnerId) {
            console.log(orderId);
            
            return response.status(400).json({
                message: "Order ID and Delivery Partner ID are required",
                error: true,
                success: false
            });
        }
        // Update order with assigned delivery partner
        const updatedOrder = await OrderModel.findOneAndUpdate(
            { orderId },
            { deliveryPartnerId, orderStatus: "Assigned" ,orderAssignedDatetime: new Date()},
            { new: true }
        );

        if (!updatedOrder) {
            console.log("Order not found in DB with orderId:", orderId);
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false
            });
        }
        notifyClients(
            preid,
            {

                updatedOrder
            },false
        );
        return response.json({
            message: "Delivery partner assigned successfully",
            error: false,
            success: true,
            data: updatedOrder
        });
    } catch (error) {
        console.log(error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

/** Assign a Delivery Partner to Multiple Orders */
export async function assignBulkDeliveryPartnerController(request, response) {
    try {
        const { orderIds, partnerId } = request.body;
        
        // Validate request
        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0 || !partnerId) {
            return response.status(400).json({
                message: "Order IDs array and Partner ID are required",
                error: true,
                success: false
            });
        }

        // Store pre-update delivery partner IDs for notifications
        const preUpdateInfo = await Promise.all(
            orderIds.map(async (orderId) => {
                const oldPartner = await GetOlddeliverypartner(orderId);
                return { orderId, oldPartnerId: oldPartner };
            })
        );

        // Update all orders with the assigned delivery partner
        const bulkUpdatePromises = orderIds.map(orderId => 
            OrderModel.findOneAndUpdate(
                { orderId },
                { 
                    deliveryPartnerId: partnerId, 
                    orderStatus: "Assigned",
                    orderAssignedDatetime: new Date()
                },
                { new: true }
            )
        );

        const updatedOrders = await Promise.all(bulkUpdatePromises);

        // Filter out any null results (orders not found)
        const successfulUpdates = updatedOrders.filter(order => order !== null);
        const failedOrderIds = orderIds.filter(orderId => 
            !successfulUpdates.find(order => order.orderId === orderId)
        );

        // Send notifications for each successfully updated order
        preUpdateInfo.forEach(({ orderId, oldPartnerId }) => {
            const updatedOrder = successfulUpdates.find(order => order.orderId === orderId);
            if (updatedOrder) {
                notifyClients(
                    oldPartnerId,
                    {
                        updatedOrder
                    },
                    false
                );
            }
        });

        // Prepare response
        if (successfulUpdates.length === 0) {
            return response.status(404).json({
                message: "No orders were found or updated",
                error: true,
                success: false
            });
        }

        return response.json({
            message: `Successfully updated ${successfulUpdates.length} orders`,
            error: false,
            success: true,
            data: {
                updatedOrders: successfulUpdates,
                failedOrderIds: failedOrderIds,
                totalProcessed: orderIds.length,
                successfulUpdates: successfulUpdates.length,
                failedUpdates: failedOrderIds.length
            }
        });

    } catch (error) {
        console.error("Bulk assignment error:", error);
        return response.status(500).json({
            message: error.message || "Internal server error during bulk assignment",
            error: true,
            success: false
        });
    }
}
/** Place a Cash on Delivery Order */
export async function CashOnDeliveryOrderController(request, response) {
    try {

        const userId = request.userId; // auth middleware 
        const { list_items, addressId,total } = request.body;
        console.log("Total : ",request.body.total);
        

        const payload = {
            userId: userId,
            orderId: `ORD-${new mongoose.Types.ObjectId()}`,
            products:list_items,
            paymentId: `pyt-${new mongoose.Types.ObjectId()}`,
            payment_status: "CASH ON DELIVERY",
            finalOrderTotal: total,
            delivery_address: addressId,
            deliveryPartnerId: null, // No delivery partner assigned initially
            orderStatus: "Not Assigned",  // Default status
        }

        console.log(payload);
        
        const generatedOrder = await OrderModel.create(payload);

        // Remove items from cart after placing order
        // await CartProductModel.deleteMany({ userId: userId });
        // await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

        return response.json({
            message: "Order placed successfully",
            error: false,
            success: true,
            data: generatedOrder
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


// update order status to Assigned ---> Out For delivery ---> Deliverd 
// update payment status also Pending ---> Paid
// export async function updateOrderStatusController(request, response) {
//     try {
//       const { orderId, status, paymentStatus } = request.body;
//         console.log(paymentStatus);
        
//       // Validate input data
//       if (!orderId || !status) {
//         return response.status(400).json({
//           message: "Order ID and new status are required",
//           error: true,
//           success: false,
//         });
//       }
  
//       // Fetch the order by orderId
//       const order = await OrderModel.findOne({ orderId });
//       if (!order) {
//         return response.status(404).json({
//           message: "Order not found",
//           error: true,
//           success: false,
//         });
//       }
  
//      // If paymentStatus is "Paid," update it
//      if (paymentStatus === "Paid") {
//         order.payment_status = "Paid";
//         // Save the updated order
//         await order.save();
//       }

//       // If the status is being changed to "Delivered", check the payment status
//       if (status === "Delivered") {
//         if (order.payment_status === "Pending") {
//           // If payment is pending, open modal for payment
//           return response.status(400).json({
//             message: "Payment is pending. Please update the payment status before delivering the order.",
//             error: true,
//             success: false,
//             paymentRequired: true, // Indicating the frontend should open a payment modal
//           });
//         }
  
//         // If payment is already received, update the order status
//         if (order.payment_status === "Paid") {            
//           // Update order status to delivered
//           const updateData = { orderStatus: "Delivered" };
          
//           // Set the orderDeliveredDatetime if not already set
//           if (!order.orderDeliveredDatetime) {
//             updateData.orderDeliveredDatetime = new Date();
//           }
//           const updatedOrder = await OrderModel.findOneAndUpdate(
//             { orderId },
//             updateData,
//             { new: true }
//           );
  
//           if (!updatedOrder) {            
//             return response.status(404).json({
//               message: "Failed to update the order status",
//               error: true,
//               success: false,
//             });
//           }
  
//           // Notify clients that the order status has been updated
//           const isadmin = true;  // Assuming the request is from an admin
//           notifyClients("", updatedOrder, isadmin);
  
//           return response.json({
//             message: "Order status updated to 'Delivered' successfully",
//             error: false,
//             success: true,
//             data: updatedOrder,
//           });
//         }
//       }
  
//       // If the status is not "Delivered", update the order status normally
//       const updateData = { orderStatus: status };
  
//       const updatedOrder = await OrderModel.findOneAndUpdate(
//         { orderId },
//         updateData,
//         { new: true }
//       );
  
//       if (!updatedOrder) {
//         return response.status(404).json({
//           message: "Order not found",
//           error: true,
//           success: false,
//         });
//       }
  
//       notifyClients("", updatedOrder, true);
  
//       return response.json({
//         message: "Order status updated successfully",
//         error: false,
//         success: true,
//         data: updatedOrder,
//       });
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       return response.status(500).json({
//         message: error.message || "Internal Server Error",
//         error: true,
//         success: false,
//       });
//     }
//   }
  

export const updateOrderStatusController = async (request, response) => {
    try {
        const { orderId, status, isPaymentDone } = request.body;

        console.log("🔄 Updating order status for:", { orderId, status, isPaymentDone });

        // Fetch order from database
        let order = await OrderModel.findOne({ orderId });

        if (!order) {
            console.log("❌ Order not found.");
            return response.status(404).json({
                message: "Order not found",
                error: true,
                success: false,
            });
        }

        // ✅ Update payment status before checking order status
        if (isPaymentDone === true && !order.isPaymentDone) {
            console.log("💰 Updating payment status for order...");
            order.isPaymentDone = true;
            await order.save();
            console.log("✅ Payment status updated successfully.");
        }

        // ✅ Now check if order can be marked as Delivered
        if (status === "Delivered") {
            console.log("🚚 Attempting to deliver order... Checking payment status.");

            if (!order.isPaymentDone) {
                console.log("❌ Payment pending. Cannot mark order as Delivered.");
                return response.status(400).json({
                    message: "Payment is pending. Please update the payment status before delivering the order.",
                    error: true,
                    success: false,
                    paymentModalRequired: true,
                });
            }

            console.log("✅ Payment is done. Proceeding to mark order as Delivered.");
            order.orderStatus = "Delivered";
            order.orderDeliveredDatetime = order.orderDeliveredDatetime || new Date();
            await order.save();

            console.log("✅ Order successfully marked as Delivered:", order);
            return response.json({
                message: "Order status updated to 'Delivered' successfully",
                error: false,
                success: true,
                data: order,
            });
        }

        // ✅ Handle other status updates if necessary
        order.orderStatus = status;
        await order.save();
        console.log("✅ Order status updated successfully:", order);

        return response.json({
            message: "Order status updated successfully",
            error: false,
            success: true,
            data: order,
        });
    } catch (error) {
        console.error("❌ Error updating order status:", error);
        return response.status(500).json({
            message: "Internal server error",
            error: true,
            success: false,
        });
    }
};



// ==============Delivery status == ""Assigned" || "Out for Delivery"  ========================
/** Fetch Orders Assigned to a Specific Delivery Partner  USED IN MY DELIVERIES PAGE TO DISPLAY NEWLY ASSIGNED ORDER*/
export async function notDeliverdOrderController(request, response) {
    try {    
    const deliveryPartnerId = request.userId; // Extract delivery partner's ID from auth middleware
    console.log(deliveryPartnerId);
    
    // Fetch delivered orders assigned to the delivery partner
    const orders = await OrderModel.find({
        deliveryPartnerId,
        orderStatus: { $in: ["Assigned", "Out for Delivery"] } // Correct filter condition
      })
      .sort({ createdAt: -1 })
      .populate('delivery_address');
      

    if (!orders.length) {
        return response.status(200).json({
            message: "No orders found for this delivery partner",
            error: true,
            success: true
        });
    }

    return response.json({
        message: "Orders fetched successfully Assigned, Out for Delivery",
        error: false,
        success: true,
        data: orders
    });

} catch (error) {
    console.log("catch",error);
    return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false
    });
}
}

// Delivery History page for admin and delivery partner dashboard 
export async function getOrdersForDeliveryPartnerHistory(request, response) {
    try {    
        const userId = request.userId; // Extract userId from the request (assuming it's added by auth middleware)

        // Fetch the user's role from the AdminModel based on userId
        const user = await AdminModel.findById(userId);

        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        // Check user role (admin or delivery partner)
        const { role } = user;

        let filterConditions = {
            orderStatus: "Delivered", // Filter for "Delivered" status
        };

        // If the user is a Delivery Partner, filter by deliveryPartnerId
        if (role === "Delivery Partner") {
            filterConditions.deliveryPartnerId = userId; // Only fetch orders for the specific delivery partner
        }

        // Fetch the orders based on the conditions
        const orders = await OrderModel.find(filterConditions)
            .sort({ createdAt: -1 })
            .populate('delivery_address');
  
        if (!orders.length) {
            return response.status(200).json({
                message: "No delivered orders found for the selected filters",
                error: true,
                success: true,
                data: [] // Ensures the frontend can safely access response.data.data
            });
            
        }

        return response.json({
            message: "Orders fetched successfully for order history",
            error: false,
            success: true,
            data: orders
        });

    } catch (error) {
        console.log("catch", error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}


export const pricewithDiscount = (price, dis = 1) => {
    const discountAmount = Math.ceil((Number(price) * Number(dis)) / 100);
    return Number(price) - Number(discountAmount);
};

/** Process Payment via Stripe */
export async function paymentController(request, response) {
    try {
        const userId = request.userId;
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body;
        const user = await UserModel.findById(userId);

        const line_items = list_items.map(item => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.productId.name,
                    images: item.productId.image,
                    metadata: { productId: item.productId._id }
                },
                unit_amount: pricewithDiscount(item.productId.price, item.productId.discount) * 100
            },
            adjustable_quantity: { enabled: true, minimum: 1 },
            quantity: item.quantity
        }));

        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: user.email,
            metadata: { userId, addressId },
            line_items,
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`
        };

        const session = await Stripe.checkout.sessions.create(params);

        return response.status(200).json(session);

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

/** Stripe Webhook Handler */
export async function webhookStripe(request, response) {
    const event = request.body;
    const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY;
    console.log("event", event);

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const lineItems = await Stripe.checkout.sessions.listLineItems(session.id);
            const userId = session.metadata.userId;
            const orderProduct = await getOrderProductItems({
                lineItems,
                userId,
                addressId: session.metadata.addressId,
                paymentId: session.payment_intent,
                payment_status: session.payment_status,
            });

            const order = await OrderModel.insertMany(orderProduct);
            console.log(order);

            if (Boolean(order[0])) {
                await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
                await CartProductModel.deleteMany({ userId });
            }
            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    response.json({ received: true });
}

// Admin dashboard Fetch data in ORDERLIST page to assign delivery partner
export async function getOrderDetailsController(request, response) {
    try {
        // Fetch orders where orderStatus is not "Delivered"
        const orderList = await OrderModel.find({ orderStatus: { $ne: "Delivered" } })
            .sort({ createdAt: -1 }) // Sort by createdAt in descending order
            .populate('delivery_address');

        if (!orderList.length) {
            return response.status(404).json({
                message: 'No orders found.',
                error: true,
                success: false,
            });
        }

        return response.json({
            message: 'Order list fetched successfully',
            data: orderList,
            error: false,
            success: true,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}

