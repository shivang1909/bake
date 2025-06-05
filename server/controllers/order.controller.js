
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";
import AdminModel from "../models/admin.model.js"; 
import mongoose from "mongoose";
import Razorpay from "razorpay";
import PromocodeModel from "../models/promocode.model.js";
import crypto from "crypto";
import { nanoid } from 'nanoid';
import AddressModel from "../models/address.model.js";
import dotenv from 'dotenv';
dotenv.config();
import {
  sendOrderDeliveredEmail,
  sendOrderConfirmationEmail,
  sendOrderReassignedEmail,
  sendBulkOrderAssignedEmail,
  sendOutForDeliveryEmail,
  sendNewOrderNotificationEmail,
  sendOrderAssignedEmail,
  sendOrderCancellationEmailToAdmin,
  sendOrderCancellationEmailToUser,
  sendOrderCancellationEmailToDeliveryPartner,
} from "../utils/emailService.js";
import {
  codupdatebydeliverypartner,
  orderstatuschange,
  newordersseHandler,
  deliveryPartnerNotification,
} from "./sseHandler.controller.js";
import sendnotification from "../utils/sendnotification.js";


async function GetOlddeliverypartner(oid) {
  const record = await OrderModel.findOne({ orderId: oid }); // Correct query syntax
  if (!record) {
    throw new Error("Order not found");
  }
  return String(record.deliveryPartnerId); // Access document directly
}

export async function assignDeliveryPartnerController(request, response) {
  try {
    const { orderId, partnerId: newDeliveryPartnerId } = request.body;

    // Validate request
    if (!orderId || !newDeliveryPartnerId) {
      return response.status(400).json({
        message: "Order ID and Delivery Partner ID are required",
        error: true,
        success: false,
      });
    }

    // Fetch the existing order
    const existingOrder = await OrderModel.findOne({ orderId }).populate(
      "delivery_address"
    );
    if (!existingOrder) {
      return response.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    // Store the old delivery partner ID before update
    const oldDeliveryPartnerId = existingOrder.deliveryPartnerId;

    // Check if the order is already assigned
    // if (existingOrder.orderStatus === "Assigned" && oldDeliveryPartnerId) {
    //     // Fetch the old delivery partner email
    //     const oldDeliveryPartner = await AdminModel.findById(oldDeliveryPartnerId, { email: 1 });
    //         console.log("📧 Sorry email sent to old delivery partner:", oldDeliveryPartner.email);

    //     if (oldDeliveryPartner && oldDeliveryPartner.email) {
    //         await sendOrderReassignedEmail(oldDeliveryPartner.email, existingOrder);
    //         console.log("📧 Sorry email sent to old delivery partner:", oldDeliveryPartner.email);
    //     }
    // }
    if (
      existingOrder.orderStatus === "Assigned" &&
      existingOrder.deliveryPartnerId
    ) {
      const oldDeliveryPartner = await AdminModel.findById(
        existingOrder.deliveryPartnerId,
        { email: 1 }
      );
      console.log('this is  existing order',existingOrder);

      if (oldDeliveryPartner && oldDeliveryPartner.email) {
        console.log("i am in if ",oldDeliveryPartner._id.toString());
        deliveryPartnerNotification({
          message: `Sorry Your Order reasinged to other for some reason you can check your current orders click here`,
          deliveryPartnerId: oldDeliveryPartner._id.toString(),
          link: `${process.env.FRONTEND_URL}/admin/dashboard/my-deliveries`,
          isRead: false,})
          console.log("before notitfication")
       sendnotification(oldDeliveryPartner._id, "Delivery Partner", `Sorry Your Order reasinged to other for some reason you can check your current orders click here`, `${process.env.FRONTEND_URL}/admin/dashboard/my-deliveries`); 
        await sendOrderReassignedEmail(oldDeliveryPartner.email, [
          existingOrder,
        ]); // Send as an array
      }
    }

    // Update order with the new delivery partner
    existingOrder.deliveryPartnerId = newDeliveryPartnerId;
    existingOrder.orderStatus = "Assigned";
    existingOrder.orderAssignedDatetime = new Date();
    await existingOrder.save();

    // Fetch new delivery partner email
    console.log(`delivery partner assigned : ${newDeliveryPartnerId}`);
    const data = {
      message: `New Order Assigned OrderID : ${existingOrder.orderId} `,
      deliveryPartnerId: newDeliveryPartnerId,
      link: `${process.env.FRONTEND_URL}/admin/dashboard/my-deliveries`,
      isRead: false,
    }
    console.log('new order assigned before store the notification')
    sendnotification(newDeliveryPartnerId, "Delivery Partner", data.message, data.link); // Call the function to send notification
    deliveryPartnerNotification(data);
    const newDeliveryPartner = await AdminModel.findById(newDeliveryPartnerId, {
      email: 1,
    });
    if (newDeliveryPartner && newDeliveryPartner.email) {
      await sendOrderAssignedEmail(newDeliveryPartner.email, existingOrder);
      console.log(
        "📧 Email sent to new delivery partner:",
        newDeliveryPartner.email
      );
    }

    return response.json({
      message: "Delivery partner assigned successfully",
      error: false,
      success: true,
      data: existingOrder,
    });
  } catch (error) {
    console.error("Error in assigning delivery partner:", error);
    return response.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
}




export async function assignBulkDeliveryPartnerController(request, response) {
    try {
        console.log("assign bulk delivery partner controller called");
        const { orderIds, partnerId, assignedIds } = request.body;

        console.log("order", orderIds);
        console.log("assign", assignedIds);
        console.log("partner", partnerId);
        
        
        let newOrders = [];
        
        // Update orders in bulk
        if (orderIds.length > 0) {
            // Use Promise.all to ensure all updates complete before moving forward
            newOrders = await Promise.all(orderIds.map(async (orderId) => {
                let order = await OrderModel.findOneAndUpdate(
                    { orderId },
                    {
                        deliveryPartnerId: partnerId,
                        orderStatus: "Assigned",
                        orderAssignedDatetime: new Date()
                    } // Ensure updated document is returned
                ).populate("delivery_address").exec(); // Ensure populate works
        
                return order; // Return updated order for Promise.all
            }));
        }
        
        console.log("newOrder", newOrders);
        
        let oldDetails = {};
        
        // Send reassignment emails to old delivery partners
        for (const orderId of assignedIds) {
            const oldOrder = await OrderModel.findOneAndUpdate(
                { orderId },
                {
                    deliveryPartnerId: partnerId,
                    orderStatus: "Assigned",
                    orderAssignedDatetime: new Date()
                } // Ensure updated document is returned
            ).populate("delivery_address").exec(); // Ensure populate works
                
          
                const deliveryPartner = await AdminModel.findById(oldOrder.deliveryPartnerId, { email: 1 });
                console.log("old delivery partner", deliveryPartner, oldOrder.deliveryPartnerId);

                deliveryPartnerNotification({
                    message: `Sorry Your Order reasinged to other for some reason you can check your current orders click here`,
                    deliveryPartnerId: oldOrder.deliveryPartnerId.toString(),
                    link: `${process.env.FRONTEND_URL}/admin/dashboard/my-deliveries`,
                    isRead: false,
                })
              
                sendnotification(oldOrder.deliveryPartnerId, request.role,`Sorry Your Order reasinged to other for some reason you can check your current orders click here` ,`${process.env.FRONTEND_URL}/admin/dashboard/my-deliveries` ); // Call the function to send notification

                if (deliveryPartner && deliveryPartner.email) {
                    if (!oldDetails[deliveryPartner.email]) {
                        oldDetails[deliveryPartner.email] = []; // Initialize as an array
                    }
                    oldDetails[deliveryPartner.email].push(oldOrder);
                }
        }
        
        console.log("oldDetails", oldDetails);
        const deliveryPartner = await AdminModel.findById(partnerId, { email: 1 });
         console.log(partnerId);
         console.log(`assignedIds: ${assignedIds} and  length of it ${assignedIds.length} `)
         const data = {
          message: `New  ${assignedIds.length} Total Order Assigned To you Click here `,
          deliveryPartnerId: partnerId,
          link: `${process.env.FRONTEND_URL}/admin/dashboard/my-deliveries`,
          isRead: false,
        }
        sendnotification(partnerId, request.role, data.message, data.link); // Call the function to send notification
        deliveryPartnerNotification(data);     
        
        // Send reassignment emails
        for (const [email, orders] of Object.entries(oldDetails)) {
            await sendOrderReassignedEmail(email, orders);
            newOrders.push(...orders);
        }
        
        console.log("newOrder2", newOrders);
        
        // Notify the new delivery partner about the assignment
        
        if (deliveryPartner && deliveryPartner.email && newOrders.length > 0) {
            console.log("📧 Email sent to new delivery partner:", deliveryPartner.email);
            await sendBulkOrderAssignedEmail(deliveryPartner.email, newOrders);
        } else {
            console.log("❌ New delivery partner email not found.");
        }
        
        // Return response
        return response.json({
            message: `Successfully updated orders`,
            error: false,
            success: true
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


export const createPaymentOrder = async (req, res) => {
  console.log(req.body);
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const { amount } = req.body;
    const options = {
      amount: amount * 100,

      currency: "INR",
      receipt: "order_receipt_1",
    };
    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);
  } catch (error) {
    return res.status(500).json({
      error: "error in razor pay",
    });
  }
};

//Verify Payment
//Verify Payment
export const verifyPayment = async (req, res) => {
  try {
    const userId = req.userId;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      list_items,
      addressId,
      special_Gift_packing,
      total,
      promocodeId,
      promocodeDiscount,
    } = req.body;
  const selectedAddress = await  AddressModel.findById(addressId);
    if (!selectedAddress) {
      return response.status(404).json({
        message: "Address not found",
        error: true,
        success: false,
      });
    }
    

   const deliveryAddress = {
      name: selectedAddress.name,
      address_line1: selectedAddress.address_line1,
      address_line2: selectedAddress.address_line2,
      city: selectedAddress.city,
      state: selectedAddress.state,
      pincode: selectedAddress.pincode,
      country: selectedAddress.country,
      mobile: selectedAddress.mobile
    };

    // Verify payment signature
    const hmac = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (hmac !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    // Build order payload
    const payload = {
      userId: userId,
      orderId : `ORD-${nanoid(6)}`,
      products: list_items,

      paymentId: razorpay_payment_id,
      payment_status: "ONLINE PAYMENT",
      finalOrderTotal: total,
      delivery_address: deliveryAddress,
      deliveryPartnerId: null,
      orderStatus: "Not Assigned",
      isPaymentDone: true,
    };
    console.log(payload);
    payload.special_Gift_packing = special_Gift_packing;
    // Handle promocode
    if (promocodeId) {
      try {
        const promocode = await PromocodeModel.findById(promocodeId);
        payload.promo_code = promocode.code;
         payload.promocodeDiscount = promocodeDiscount;
        await PromocodeModel.findByIdAndUpdate(promocodeId, {
          $set: { users: userId },
        });
      } catch (promoError) {
        console.error("Error applying promocode:", promoError);
      }
    }

    // Reduce stock
    for (const item of list_items) {
      const { productId, variantPrices } = item;
      if (!productId || !Array.isArray(variantPrices)) continue;

      const product = await ProductModel.findById(productId);
      if (!product) continue;

      for (const variant of variantPrices) {
        const { weight, quantity } = variant;
        const matchedVariant = product.weightVariants.find(
          (v) => v.weight === weight
        );
        if (!matchedVariant) continue;

        await ProductModel.updateOne(
          { _id: productId, "weightVariants._id": matchedVariant._id },
          { $inc: { "weightVariants.$.qty": -quantity } }
        );
      }
    }

    // Gift wrapping
    let giftPackingTotal = 0;
    for (const item of list_items) {
      for (const variant of item.variantPrices) {
        if (variant.isGiftWrap) {
          giftPackingTotal += variant.giftWrapCharge || 0;
        }
      }
    }
    if (giftPackingTotal > 0) {
      payload.special_Gift_packing = giftPackingTotal;
    }

    // Create order
    const generatedOrder = await OrderModel.create(payload);
    newordersseHandler(generatedOrder);
    // Clear user cart
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    // Email notifications
    const user = await UserModel.findById(userId);
    const adminEmail = process.env.ADMIN_EMAIL;

    if (user?.email) {
      await sendOrderConfirmationEmail(user.email, generatedOrder);
    }

    if (adminEmail) {
      await sendNewOrderNotificationEmail(adminEmail, generatedOrder);
    }

    return res.status(200).json({ success: true, data: generatedOrder });
  } catch (error) {
    console.log("Payment verification error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Error verifying payment and creating order",
    });
  }
};


export async function CashOnDeliveryOrderController(request, response) {
  try {
    const userId = request.userId; // auth middleware
    const { list_items, addressId, total,special_Gift_packing, promocodeId, promocodeDiscount } =
      request.body;

      
    console.log("this is list item : ", JSON.stringify(list_items));
    const selectedAddress = await  AddressModel.findById(addressId);
    if (!selectedAddress) {
      return response.status(404).json({
        message: "Address not found",
        error: true,
        success: false,
      });
    }

   const deliveryAddress = {
      name: selectedAddress.name,
      address_line1: selectedAddress.address_line1,
      address_line2: selectedAddress.address_line2,
      city: selectedAddress.city,
      state: selectedAddress.state,
      pincode: selectedAddress.pincode,
      country: selectedAddress.country,
      mobile: selectedAddress.mobile
    };

    // Create the base order payload
    const payload = {
      userId: userId,
      orderId : `ORD-${nanoid(6)}`,

      products: list_items,
      paymentId: `pyt-${new mongoose.Types.ObjectId()}`,
      payment_status: "CASH ON DELIVERY",
      finalOrderTotal: total,
      delivery_address: deliveryAddress,
      deliveryPartnerId: null, // No delivery partner assigned initially
      orderStatus: "Not Assigned", // Default status
    };
    payload.special_Gift_packing = special_Gift_packing;
    console.log("********************************");
    
console.log(JSON.stringify(payload));

    // If promocode is provided, verify and apply it
    if (promocodeId) {
      try {
        // Find the promocode in the database
        const promocode = await PromocodeModel.findById(promocodeId);

        // Add promocode to order payload
        payload.promo_code = promocode.code;
        payload.promocodeDiscount = promocodeDiscount;

        // Update promocode usage count
        await PromocodeModel.findByIdAndUpdate(promocodeId, {
          $set: { users: userId },
        });
      } catch (promoError) {
        console.error("Error applying promocode:", promoError);
        // Continue order creation even if promocode application fails
      }
    }
    // Reduce the stock of each product variant

    for (const item of list_items) {
      console.log("Current item:", item); // Debugging

      const { productId, variantPrices } = item || {};

      if (!productId) {
        console.error("Missing productId:", item);
        continue;
      }

      if (!Array.isArray(variantPrices) || variantPrices.length === 0) {
        console.error("variantPrices is missing or empty:", item);
        continue;
      }

      // Fetch the product from the database
      const product = await ProductModel.findOne({ _id: productId });

      if (!product) {
        console.error("Product not found for ID:", productId);
        continue;
      }

      for (const variant of variantPrices) {
        const { weight, quantity } = variant;

        if (!weight) {
          console.error("Missing weight in variantPrices:", variantPrices);
          continue;
        }

        if (quantity === undefined || isNaN(quantity)) {
          console.error("Invalid quantity:", quantity);
          continue;
        }

        // Find the matching variant by weight
        const matchedVariant = product.weightVariants.find(
          (v) => v.weight === weight
        );

        if (!matchedVariant) {
          console.error(
            `No variant found with weight ${weight} in product`,
            productId
          );
          continue;
        }

        const variantId = matchedVariant._id; // Get the correct variant ID

        console.log("Updating stock for Product ID:", productId);
        console.log("Variant ID:", variantId);
        console.log("Quantity:", quantity);

        // Update stock for this variant
        await ProductModel.updateOne(
          { _id: productId, "weightVariants._id": variantId },
          { $inc: { "weightVariants.$.qty": -quantity } } // Reduce stock
        );
        console.log("after querry")
      }
    }


     


    // Create the order
    const generatedOrder = await OrderModel.create(payload);
    console.log("this is generated Order details :", generatedOrder);
    newordersseHandler(generatedOrder);

    // Remove items from cart after placing order
    await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });

    // ================= mail notification code =================
    // Fetch user details for email
    const user = await UserModel.findById(userId);
    console.log("user", user);
    console.log("user email", user.email);

    const adminEmail = process.env.ADMIN_EMAIL; // Admin email from env

    // Send confirmation email to customer
    if (user && user.email) {
      console.log("helooo user");
      await sendOrderConfirmationEmail(user.email, generatedOrder);
    }

    // Send new order notification to admin
    if (adminEmail) {
      console.log("helooo admin");
      await sendNewOrderNotificationEmail(adminEmail, generatedOrder);
    }

    return response.json({
      message: "Order placed successfully",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return response.status(500).json({
      message: error.message || "Error placing order",
      error: true,
      success: false,
    });
  }
}


// export async function CashOnDeliveryOrderController(request, response) {
//   try {
//     const userId = request.userId;
//     const { list_items, addressId, total, promocodeId, promocodeDiscount } = request.body;

//     // Process gift notes and calculate charges
//     let giftPackingTotal = 0;
//     const processedItems = list_items.map(item => {
//       return {
//         ...item,
//         variantPrices: item.variantPrices.map(variant => {
//           // Calculate gift wrap charges based on actual notes count
//           const notesCount = variant.isGiftWrap ? (variant.giftNotes?.length || 0) : 0;
//           const variantCharge = variant.isGiftWrap ? 
//             (variant.giftWrapCharge || 0) : 0;
          
//           giftPackingTotal += variantCharge;
          
//           // Ensure giftNotes is properly formatted
//           const cleanGiftNotes = variant.isGiftWrap 
//             ? (variant.giftNotes || []).filter(note => note && note.trim() !== "")
//             : undefined;

//           return {
//             ...variant,
//             giftNotes: cleanGiftNotes,
//             giftWrapCharge: variantCharge
//           };
//         })
//       };
//     });

//     // Create the base order payload
//     const payload = {
//       userId: userId,
//       orderId: `ORD-${nanoid(6)}`,
//       products: processedItems,
//       paymentId: `pyt-${new mongoose.Types.ObjectId()}`,
//       payment_status: "CASH ON DELIVERY",
//       finalOrderTotal: total,
//       delivery_address: addressId,
//       special_Gift_packing: giftPackingTotal,
//       deliveryPartnerId: null,
//       orderStatus: "Not Assigned",
//     };
//     console.log("=================================");
//     console.log(payload);
//     console.log("=================================");
    
//     // Promocode handling
//     if (promocodeId) {
//       try {
//         const promocode = await PromocodeModel.findById(promocodeId);
//         if (promocode) {
//           payload.promo_code = promocode.code;
//           await PromocodeModel.findByIdAndUpdate(promocodeId, {
//             $addToSet: { users: userId }
//           });
//         }
//       } catch (promoError) {
//         console.error("Error applying promocode:", promoError);
//       }
//     }

//     // Stock reduction logic
//     for (const item of processedItems) {
//       const { productId, variantPrices } = item || {};
//       if (!productId || !Array.isArray(variantPrices)) continue;

//       const product = await ProductModel.findOne({ _id: productId });
//       if (!product) continue;

//       for (const variant of variantPrices) {
//         const { weight, quantity } = variant;
//         if (!weight || quantity === undefined || isNaN(quantity)) continue;

//         const matchedVariant = product.weightVariants.find(v => v.weight === weight);
//         if (!matchedVariant) continue;

//         await ProductModel.updateOne(
//           { _id: productId, "weightVariants._id": matchedVariant._id },
//           { 
//             $inc: { "weightVariants.$.qty": -quantity },
//             $set: { "weightVariants.$.updatedAt": new Date() }
//           }
//         );
//       }
//     }

//     // Create the order
//     const generatedOrder = await OrderModel.create(payload);
//     newordersseHandler(generatedOrder);

//     // Clear user's cart
//     await UserModel.updateOne(
//       { _id: userId },
//       { 
//         $set: { shopping_cart: [] }
//       }
//     );

//     // Email notifications
//     const user = await UserModel.findById(userId).select('email name');
//     const adminEmail = process.env.ADMIN_EMAIL;
//     console.log("this is user",user);
    
//     if (user?.email) {
//       try {
//         await sendOrderConfirmationEmail({
//           email: user.email,
//           name: user.name,
//           order: generatedOrder
//         });
//       } catch (emailError) {
//         console.log("this is error in sending mail to user ", emailError);
        
//         console.error("Failed to send confirmation email:", emailError);
//       }
//     }
//     else
//     {
//       console.log("this is inside else no mail send to user");
      
//     }
//     console.log("this is admin mail",adminEmail);
    
//     if (adminEmail) {
//       try {
//         await sendNewOrderNotificationEmail({
//           email: adminEmail,
//           order: generatedOrder
//         });
//       } catch (adminEmailError) {
//         console.error("Failed to send admin notification:", adminEmailError);
//       }
//     }
//     else
//     {
//       console.log("this is inside else no mail send to admin");
//     }

//     return response.json({
//       message: "Order placed successfully",
//       error: false,
//       success: true,
//       data: generatedOrder,
//     });

//   } catch (error) {
//     console.error("Order creation error:", error);
    
//     // Specific error handling
//     if (error.name === 'ValidationError') {
//       return response.status(400).json({
//         message: "Validation failed: " + error.message,
//         error: true,
//         success: false,
//       });
//     }

//     if (error.code === 11000) {
//       return response.status(409).json({
//         message: "Order ID conflict, please try again",
//         error: true,
//         success: false,
//       });
//     }

//     return response.status(500).json({
//       message: "Internal server error while processing order",
//       error: true,
//       success: false,
//     });
//   }
// }

// send mail when oprder is cancelled (Admin,user,Delivery Partner If applicalbe)
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const adminEmail = process.env.ADMIN_EMAIL;
    // Step 1: Find the order and populate user + deliveryPartner if available
    const order = await OrderModel.findById(orderId)
      .populate("userId", "name email")
      .populate("deliveryPartnerId", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    console.log("Order Detyails:", order);

    // Step 2: Prevent cancel if order is already out or delivered
    if (["Out for delivery", "Delivered"].includes(order.orderStatus)) {
      return res.status(400).json({ message: "Cannot cancel this order" });
    }

    // Step 3: Update order status to Cancelled
    order.orderStatus = "Cancelled";
    await order.save();

    // Step 4: Send email to Admin
    await sendOrderCancellationEmailToAdmin(adminEmail, order);

    // Step 5: Notify User
    if (order.userId?.email) {
      await sendOrderCancellationEmailToUser(order.userId.email, order);
    }
    if (order.deliveryPartnerId?.email) {
      await sendOrderCancellationEmailToDeliveryPartner(
        order.deliveryPartnerId.email,
        order
      );
    }
    return res
      .status(200)
      .json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("❌ Error in cancelOrder:", error);
    res.status(500).json({ message: "Server error while cancelling order" });
  }
};

export const updateOrderStatusController = async (request, response) => {
  try {
    const { orderId, status, isPaymentDone, otpEntered } = request.body;

    console.log("🔄 Updating order status for:", {
      orderId,
      status,
      isPaymentDone,
      otpEntered,
    });

    // Fetch order from database
    let order = await OrderModel.findOne({ orderId }).populate(
      "deliveryPartnerId",
      "name"
    );

    if (!order) {
      console.log("❌ Order not found.");
      return response.status(404).json({
        message: "Order not found",
        error: true,
        success: false,
      });
    }

    // ✅ Generate and store OTP when order status is "Out for Delivery"
    if (
      status === "Out for Delivery" &&
      order.orderStatus !== "Out for Delivery"
    ) {
      console.log("🚚 Order is now Out for Delivery. Generating OTP...");

      const otp = crypto.randomInt(100000, 999999).toString(); // Generate 6-digit OTP
      order.otp = otp; // Store OTP in order document
      order.orderStatus = "Out for Delivery"; // Update order status
      await order.save();

      const user = await UserModel.findById(order.userId, { email: 1 });
      if (user && user.email) {
        await sendOutForDeliveryEmail(user.email, order, otp);
        console.log("📧 Out for Delivery email sent with OTP:", otp);
      } else {
        console.log("❌ Unable to send email. User email not found.");
      }
      console.log('out for delivery otp is')
      return response.json({
        message: "Out for Delivery OTP generated",
        error: false,
        success: true,
        data: order,
      });
    }

    // ✅ Verify OTP and update payment status
    if (otpEntered) {
      console.log("order .otp is", order.otp);

      if (order.otp == otpEntered) {
        console.log("✅ OTP Verified. Updating payment status to PAID.");
        order.isPaymentDone = true;

        order.otp = null; // Remove OTP after verification
        await order.save();

        // ✅ Automatically mark as Delivered
        order.orderStatus = "Delivered";
        console.log("this is order ", order);
        order.orderDeliveredDatetime = new Date();
        if(order.payment_status === "CASH ON DELIVERY"){
          await AdminModel.updateOne(
          { _id: order.deliveryPartnerId._id, role: "Delivery Partner" },
          { $inc: { paymentReceived: order.finalOrderTotal } }
        );
    }

        await order.save();

        console.log("✅ Order status updated to Delivered.");
        const data = {
          message: `Order Delivered by ${order.deliveryPartnerId.name}. OrderID: ${order.orderId}
                  Total Ammount Received: ${order.finalOrderTotal} `,
          link: `${process.env.FRONTEND_URL}/admin/dashboard/admin-cod-status`,
          isRead: false,
        };
        sendnotification(process.env.ADMIN_ID,"Admin",data.message,data.link);
        orderstatuschange(data);
        

        const user = await UserModel.findById(order.userId, { email: 1 });

        if (user.email) {
          console.log("inside send mail", user.email);
          await sendOrderDeliveredEmail(user.email, order);
          console.log("📧 Order Delivered email sent.");
        }
        else
        {
          console.log("❌ Unable to send email. User email not found.");
        }

        return response.json({
          message: "OTP verified. Payment updated & Order Delivered!",
          error: false,
          success: true,
          data: order,
        });
      } else {
        console.log("❌ Invalid OTP entered.");
        return response.status(400).json({
          message: "Invalid OTP. Please try again.",
          error: true,
          success: false,
        });
      }
    }

    // ✅ Check if order can be marked as Delivered
    if (status === "Delivered" && order.orderStatus !== "Delivered") {
        return response.status(400).json({
          message:
            "Enter otp to mark order as Delivered.",
          error: true,
          success: false,
          paymentModalRequired: true,
        });
    }

  
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    return response.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};


export const updateCODStatusController = async (request, response) => {
  try {
    const deliveryPartnerId = request.userId;

    await OrderModel.updateMany(
      {
        deliveryPartnerId,
        cod_status: "NOT COMPLETED",
        orderStatus: "Delivered",
      },
      { $set: { cod_status: "PENDING" } }
    );
    const dp = await AdminModel.findById(deliveryPartnerId, {
      paymentReceived: 1,
      name: 1,
    });
    console.log("this is dp", dp);
    console.log("dp.name", dp.paymentReceived);
    const data ={
      message: `COD status updated to PENDING by ${dp.name}`,
      deliveryPartnerId: deliveryPartnerId,
      link: `${process.env.FRONTEND_URL}/admin/dashboard/delivery-cod-status`,
      isRead: false,
    }
    sendnotification(process.env.ADMIN_ID, "Admin", data.message, data.link); // Call the function to send notification
    codupdatebydeliverypartner(data);
      dp.paymentReceived = 0; // Reset paymentReceived to 0
    await dp.save(); // Save the changes to the database
    return response.status(200).json({
      message:
        "COD status updated, payment reset, and added to pendingFromAdmin",
      success: true,
    });
  } catch (error) {
    console.error("Error updating COD status:", error);
    return response
      .status(500)
      .json({ message: "Internal Server Error", error });
  }
};

export const updateAdminCODStatusController = async (request, response) => {
  try {
    console.log('updateAdminCODStatusController called');
    const userID = request.userId;
    const { filterPartner } = request.body; // filterPartner is an ObjectId (string)

    console.log("Filter Partner ID:", filterPartner);

    // Ensure filterPartner is a valid ObjectId
    if (!filterPartner) {

      const ordersToUpdate = await OrderModel.find(
        { cod_status: "PENDING", orderStatus: "Delivered" },
        "deliveryPartnerId"
      );
      
      // 2. Extract unique delivery partner IDs 
      const deliveryPartnerIds = [
        ...new Set(
          ordersToUpdate
            .map(order => order.deliveryPartnerId?.toString())
            .filter(Boolean)
        )
      ];
      console.log(deliveryPartnerIds);
      
      await OrderModel.updateMany(
        { cod_status: "PENDING", orderStatus: "Delivered" },
        { $set: { cod_status: "COMPLETED" } }
      );
      const data ={
        message: `COD status updated to COMPLETED by Admin`,
        deliveryPartnerId: deliveryPartnerIds,
        link: `${process.env.FRONTEND_URL}/admin/dashboard/delivery-cod-status`,
        isRead: false,
      }
      sendnotification(deliveryPartnerIds, 'Delivery Partner', data.message, data.link); // Call the function to send notification
      deliveryPartnerNotification(data)

      return response
        .status(200)
        .json({
          message: "All data updated in Delivery partne",
          success: true,
        });
    }

    // Convert filterPartner to ObjectId (if it's a string)
    const partnerObjectId = new mongoose.Types.ObjectId(filterPartner);

    // Update all orders assigned to this delivery partner where COD is pending
    await OrderModel.updateMany(
      { deliveryPartnerId: partnerObjectId, cod_status: "PENDING" },
      { $set: { cod_status: "COMPLETED" } }
    );
    console.log("this is filter partner check", filterPartner);
    const data = {
      message: `COD status updated to COMPLETED by Admin`,
      deliveryPartnerId: filterPartner,
      link: `${process.env.FRONTEND_URL}/admin/dashboard/delivery-cod-status`,
      isRead: false,
    };
    sendnotification(filterPartner, 'Delivery Partner', data.message, data.link); // Call the function to send notification
    deliveryPartnerNotification(data)
    return response.status(200).json({
      message: "COD status updated successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error updating COD status:", error);
    return response
      .status(500)
      .json({ message: "Internal Server Error", error });
  }
};

export async function getCODOrdersHistory(request, response) {
  try {
    let filterConditions = {
      cod_status: { $ne: "COMPLETED" }, // COD status should NOT be "COMPLETED"
      orderStatus: "Delivered",
      // deliveryPartnerId: request.userId // Filter by the current delivery partner's ID
    };
    console.log("1210", request.role);

    // If the user is a Delivery Partner, filter by deliveryPartnerId
    if (request.role === "Delivery Partner") {
      console.log("1213");

      filterConditions.deliveryPartnerId = request.userId; // Only fetch orders for the specific delivery partner
    }

    // Fetch the orders based on the conditions
    const orders = await OrderModel.find(filterConditions)
      .sort({ createdAt: -1 })
      .populate("delivery_address")
      .populate({
        path: "deliveryPartnerId", // Assuming this field refers to AdminModel
        select: "name", // Fetch only the name field
      });

    return response.json({
      message: "Orders fetched successfully for order history",
      error: false,
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log("catch", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


// ==============Delivery status == ""Assigned" || "Out for Delivery"  ========================
/** Fetch Orders Assigned to a Specific Delivery Partner  USED IN MY DELIVERIES PAGE TO DISPLAY NEWLY ASSIGNED ORDER*/
export async function notDeliverdOrderController(request, response) {
  try {
    const deliveryPartnerId = request.userId; // Extract delivery partner's ID from auth middleware
    console.log(deliveryPartnerId);

    // Fetch delivered orders assigned to the delivery partner
    const orders = await OrderModel.find({
      deliveryPartnerId,
      orderStatus: { $in: ["Assigned", "Out for Delivery"] }, // Correct filter condition
    })
      .sort({ createdAt: -1 })

    if (!orders.length) {
      return response.status(200).json({
        message: "No orders found for this delivery partner",
        error: true,
        success: true,
      });
    }

    return response.json({
      message: "Orders fetched successfully Assigned, Out for Delivery",
      error: false,
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log("catch", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Delivery History page for admin and delivery partner dashboard
export async function getOrdersForDeliveryPartnerHistory(request, response) {
  try {
    console.log("delivery history");

    const userId = request.userId; // Extract userId from the request (assuming it's added by auth middleware)

    // Fetch the user's role from the AdminModel based on userId
    const user = await AdminModel.findById(userId);

    if (!user) {
      return response.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // Check user role (admin or delivery partner)
    const { role } = user;

  
      let filterConditions = {
        orderStatus: { $in: ["Delivered", "Cancelled"] }, // Filter for "Delivered" or "Cancelled" status
      };
      

    // If the user is a Delivery Partner, filter by deliveryPartnerId
    if (role === "Delivery Partner") {
      filterConditions.deliveryPartnerId = userId; // Only fetch orders for the specific delivery partner
    }

    // Fetch the orders based on the conditions
    const orders = await OrderModel.find(filterConditions)
      .sort({ createdAt: -1 })
      .populate({
        path: "deliveryPartnerId", // Assuming this field refers to AdminModel
        select: "name", // Fetch only the name field
      });

    if (!orders.length) {
      return response.status(200).json({
        message: "No delivered orders found for the selected filters",
        error: true,
        success: true,
        data: [], // Ensures the frontend can safely access response.data.data
      });
    }
    console.log('this is oreder history data',orders)
    return response.json({
      message: "Orders fetched successfully for order history",
      error: false,
      success: true,
      data: orders,
    });
  } catch (error) {
    console.log("catch", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
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
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

// Admin dashboard Fetch data in ORDERLIST page to assign delivery partner
export async function getOrderDetailsController(request, response) {
  try {
    // Fetch orders where orderStatus is not "Delivered"
    const orderList = await OrderModel.find({
      orderStatus: { $nin: ["Delivered", "Cancelled"] }
    })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .populate("delivery_address");

    return response.status(200).json({
      message: orderList.length
        ? "Order list fetched successfully"
        : "No orders found.",
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

export async function getUserDeliverdOrderController(req, res) {
  try {
    const userId = req.userId; //  uming user ID is extracted from the auth middleware

    // Fetch delivered orders for the specific user
    const deliveredOrders = await OrderModel.find({ userId: userId });

    if (deliveredOrders.length === 0) {
      return res.status(404).json({ message: "No delivered orders found." });
    }

    res.status(200).json(deliveredOrders);
  } catch (error) {
    console.error("Error fetching delivered orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
