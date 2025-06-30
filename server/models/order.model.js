import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  weight: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // Price with GST
  discount: { type: Number, required: true }, // Discount in percentage
  giftWrapCharge: { type: Number, default: 0 }, // Gift packing charges
  isGiftWrap : { type: Boolean, default: false }, // Gift packing charges
  giftNotes: { 
    type: [String], 
    default: [] 
  }
},{_id:false});

const productSchema = new mongoose.Schema({
   itemname: { type: String, required: true },
   coverimage: { type: String, required: true },
   variantPrices: [variantSchema]
},{_id:false});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
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
  delivery_address: {
    name: { type: String, default: "" },
    address_line1: { type: String, default: "" },
    address_line2: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    country: { type: String, default: "" },
    mobile: { type: Number, default: null }
  },
  promo_code: { type: String, default: null },
  promocodeDiscount: { type: Number, default: 0 },
  delivery_charges: { type: Number, default: 0 },
  special_Gift_packing: { type: Number, default: 0 },
  invoice_receipt: { type: String, required: false },
  deliveryPartnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  finalOrderTotal :{type: Number},
  orderStatus: { 
    type: String, 
    default: 'Not Assigned' 
  },
  otp:{type:Number,default: null},
  orderAssignedDatetime: { type: Date, default: null },
  orderDeliveredDatetime: { type: Date, default: null }
}, { timestamps: true });

const OrderModel = mongoose.model('Order', orderSchema);
export default OrderModel;
