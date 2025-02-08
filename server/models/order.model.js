// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//     userId : {
//         type : mongoose.Schema.ObjectId,
//         ref : 'User'
//     },
//     orderId : {
//         type : String,
//         required : [true, "Provide orderId"],
//         unique : true
//     },
//     productId : {
//         type : mongoose.Schema.ObjectId,
//         ref : "product"
//     },
//     product_details : {
//         name : String,
//         image : Array,
//     },
//     paymentId : {
//         type : String,
//         default : ""
//     },
//     payment_status : {
//         type : String,
//         default : ""
//     },
//     delivery_address : {
//         type : mongoose.Schema.ObjectId,
//         ref : 'address'
//     },
//     subTotalAmt : {
//         type : Number,
//         default : 0
//     },
//     totalAmt : {
//         type : Number,
//         default : 0
//     },
//     invoice_receipt : {
//         type : String,
//         default : ""
//     }
// },{
//     timestamps : true
// })

// const OrderModel = mongoose.model('order',orderSchema)

// export default OrderModel

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    orderId: {
        type: String,
        required: [true, "Provide orderId"],
        unique: true,
    },
    productId: {
        type: mongoose.Schema.ObjectId,
        ref: "product",
    },
    product_details: {
        name: String,
        image: Array,
    },
    paymentId: {
        type: String,
        default: "",
    },
    payment_status: {
        type: String,
        default: "",
    },
    delivery_address: {
        type: mongoose.Schema.ObjectId,
        ref: "address",
    },
    subTotalAmt: {
        type: Number,
        default: 0,
    },
    totalAmt: {
        type: Number,
        default: 0,
    },
    invoice_receipt: {
        type: String,
        default: "",
    },
    deliveryPartnerId: {
        type: mongoose.Schema.ObjectId,
        ref: "admin", // Reference changed from "User" to "admin"
        default: null, // Initially, no delivery partner assigned
    },
    orderStatus: { 
        type: String, 
        enum: ['Pending', 'Assigned', 'In Progress', 'Delivered', 'Cancelled'], 
        default: 'Pending' 
      },
}, {
    timestamps: true,
});

const OrderModel = mongoose.model("order", orderSchema);

export default OrderModel;
