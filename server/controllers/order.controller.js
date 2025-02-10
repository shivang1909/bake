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
import mongoose from "mongoose";

/** Place a Cash on Delivery Order */
export async function CashOnDeliveryOrderController(request, response) {
    try {
        const userId = request.userId; // auth middleware 
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body;

        const payload = list_items.map(el => ({
            userId: userId,
            orderId: `ORD-${new mongoose.Types.ObjectId()}`,
            productId: el.productId._id,
            product_details: {
                name: el.productId.name,
                image: el.productId.image
            },
            paymentId: "",
            payment_status: "CASH ON DELIVERY",
            delivery_address: addressId,
            subTotalAmt: subTotalAmt,
            totalAmt: totalAmt,
            deliveryPartnerId: null, // No delivery partner assigned initially
            orderStatus: "Pending",  // Default status
        }));

        const generatedOrder = await OrderModel.insertMany(payload);

        // Remove items from cart after placing order
        await CartProductModel.deleteMany({ userId: userId });
        await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

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

/** Assign a Delivery Partner to an Order */
export async function assignDeliveryPartnerController(request, response) {
    try {
        // const { orderId, deliveryPartnerId } = request.body;
        const orderId =request.body.orderId;
        const deliveryPartnerId = request.body.partnerId;
        console.log(deliveryPartnerId);
        
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
            { deliveryPartnerId, orderStatus: "Assigned" },
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
        return response.json({
            message: "Delivery partner assigned successfully",
            error: false,
            success: true,
            data: updatedOrder
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// import OrderModel from "../models/OrderModel.js"; // Adjust the import based on your project structure

export async function updateOrderStatusController(request, response) {
  try {
    const { orderId, status } = request.body;
    if (!orderId || !status) {
      return response.status(400).json({
        message: "Order ID and new status are required",
        error: true,
        success: false,
      });
    }
    // Update order status in the database
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { orderId },
      { orderStatus: status },
      { new: true } // Returns the updated document
    );

    if (!updatedOrder) {
      return response.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    return response.json({
      message: "Order status updated successfully",
      error: false,
      success: true,
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return response.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}


/** Fetch Orders Assigned to a Specific Delivery Partner */
export async function getOrdersForDeliveryPartnerController(request, response) {
    try {    
        const deliveryPartnerId = request.userId; // Extract delivery partner's ID from auth middleware        
        // Fetch orders assigned to the delivery partner
        const orders = await OrderModel.find({ deliveryPartnerId })
            .sort({ createdAt: -1 })
            .populate('delivery_address');

        if (!orders.length) {
            return response.status(200).json({  // ✅ Return 200 OK instead of 404
                message: "No orders found for this delivery partner",
                error: false,
                success: true,
                data: []
            });
        }

        return response.status(200).json({
            message: "Orders fetched successfully",
            error: false,
            success: true,
            data: orders
        });

    } catch (error) {
        console.log("Error fetching orders:", error);
        return response.status(500).json({
            message: error.message || "Internal Server Error",
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

/** Fetch Order Details */
export async function getOrderDetailsController(request, response) {
    try {
        // console.log("Fetching orders...");
        const orderList = await OrderModel.find()
            .sort({ createdAt: -1 })
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
        // console.error("Error fetching orders:", error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false,
        });
    }
}
