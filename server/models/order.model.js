import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  weight: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // Price with GST
  discount: { type: Number, required: true }, // Discount in percentage
  isGiftWrap : { type: Boolean, default: false }, // Gift packing charges
  giftNote: {type: String, default: null}
},{_id:false});

const productSchema = new mongoose.Schema({
   itemname: { type: String, required: true },
   coverimage: { type: String, required: true },
   variantPrices: [variantSchema],
  gst: { type: Number, required: true, default:5 }
},{_id:false});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
  orderId: { type: String, required: true, unique: true },
  products: [productSchema],
  paymentId: {type: String, required: true },
  payment_status: { 
    type: String, 
    required: true, 
    enum: ['CASH ON DELIVERY', 'ONLINE PAYMENT'] 
  },
  cod_status: { type: String, enum: ['NOT COMPLETED','PENDING', 'COMPLETED'], default: 'NOT COMPLETED' },
  isPaymentDone : {type : Boolean,default : false },
  delivery_address: { type: mongoose.Schema.Types.ObjectId, required: true,ref:'address' },
  promo_code: { type: String, default: null },
  delivery_charges: { type: Number, default: 0 },
  special_Gift_packing: { type: Number, default: 0 },
  invoice_receipt: { type: String, required: false },
  deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  finalOrderTotal :{type: Number},
  orderStatus: { 
    type: String, 
    default: 'Not Assigned' 
  },
  orderAssignedDatetime: { type: Date, default: null },
  orderDeliveredDatetime: { type: Date, default: null }
}, { timestamps: true });

const OrderModel = mongoose.model('Order', orderSchema);
export default OrderModel;
