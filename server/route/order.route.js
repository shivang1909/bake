// import { Router } from 'express'
// import auth from '../middleware/auth.js'
// import { CashOnDeliveryOrderController, getOrderDetailsController, paymentController } from '../controllers/order.controller.js'

// const orderRouter = Router()

// orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
// orderRouter.post('/checkout',auth,paymentController)
// // orderRouter.get("/order-list",auth,getOrderDetailsController)
// orderRouter.get("/order-list",getOrderDetailsController)

// export default orderRouter

import { Router } from 'express';
import auth from '../middleware/auth.js';
import { 
    CashOnDeliveryOrderController, 
    getOrderDetailsController, 
    paymentController, 
    assignDeliveryPartnerController, // 🆕 New Controller for assigning Delivery Partner
    updateOrderStatusController,
    assignBulkDeliveryPartnerController,
    getOrdersForDeliveryPartnerHistory,
    notDeliverdOrderController,
    getUserDeliverdOrderController,
    updateCODStatusController,
    updateAdminCODStatusController,
    getCODOrdersHistory,
    verifyPayment,
    createPaymentOrder,
    cancelOrder
} from '../controllers/order.controller.js';
import { admin } from '../middleware/Admin.js';

const orderRouter = Router();

orderRouter.post("/cash-on-delivery", auth, CashOnDeliveryOrderController);
orderRouter.post('/checkout', auth, createPaymentOrder);
orderRouter.post('/verifyPayment',auth,verifyPayment)
// All Deliverd Order List in User side 
orderRouter.get("/my-order-list",auth, getUserDeliverdOrderController);

//All order list in Admin side
orderRouter.get("/order-list", getOrderDetailsController);

// 🆕 Assign a Delivery Partner to an Order (Admin Only)
orderRouter.put("/assign-delivery-partner", auth, assignDeliveryPartnerController);

// 🆕 Assign a One Delivery Partner to Multiple Order 
orderRouter.put("/bulk-assign-delivery-partner", auth, assignBulkDeliveryPartnerController);

// udate order status assigned --> delivered
orderRouter.put("/update-order-status", auth, updateOrderStatusController);

orderRouter.put("/update-cod-status", auth, updateCODStatusController);
//cod status update by admin
orderRouter.put("/update-admin-cod-status", auth, updateAdminCODStatusController);
orderRouter.put("/cancel/:id",auth,cancelOrder)

// COD order history
orderRouter.get("/cod-order-history", auth,admin,getCODOrdersHistory);

// delivery patner history
orderRouter.get("/delivery-partner-orders-history", auth, getOrdersForDeliveryPartnerHistory);

// delivery partner assign or out for delivery My deliveries page
orderRouter.get("/delivery-partner-not-deliverd", auth, notDeliverdOrderController);


export default orderRouter;
