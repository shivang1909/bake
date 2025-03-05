// import { Router } from 'express'
// import auth from '../middleware/auth.js'
// import { CashOnDeliveryOrderController, getOrderDetailsController, paymentController, webhookStripe } from '../controllers/order.controller.js'

// const orderRouter = Router()

// orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
// orderRouter.post('/checkout',auth,paymentController)
// orderRouter.post('/webhook',webhookStripe)
// // orderRouter.get("/order-list",auth,getOrderDetailsController)
// orderRouter.get("/order-list",getOrderDetailsController)

// export default orderRouter

import { Router } from 'express';
import auth from '../middleware/auth.js';
import { 
    CashOnDeliveryOrderController, 
    getOrderDetailsController, 
    paymentController, 
    webhookStripe,
    assignDeliveryPartnerController, // 🆕 New Controller for assigning Delivery Partner
    getOrdersForDeliveryPartnerController, // 🆕 New Controller for fetching assigned orders
    updateOrderStatusController
} from '../controllers/order.controller.js';

const orderRouter = Router();

orderRouter.post("/cash-on-delivery", auth, CashOnDeliveryOrderController);
orderRouter.post('/checkout', auth, paymentController);
orderRouter.post('/webhook', webhookStripe);
orderRouter.get("/order-list", getOrderDetailsController);

// 🆕 Assign a Delivery Partner to an Order (Admin Only)
orderRouter.put("/assign-delivery-partner", auth, assignDeliveryPartnerController);

// 🆕 Fetch Orders Assigned to a Delivery Partner
orderRouter.get("/delivery-partner-orders", auth, getOrdersForDeliveryPartnerController);
orderRouter.put("/update-order-status", auth, updateOrderStatusController);

export default orderRouter;
