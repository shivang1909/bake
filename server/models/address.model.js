import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    name: {
        type: String,
        default: ""
    },
    address_line1: {
        type: String,
        default: ""
    },
    address_line2: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    state: {
        type: String,
        default: ""
    },
    pincode: {
        type: String
    },
    country: {
        type: String
    },
    mobile: {
        type: Number,
        default: null
    },
    status: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const AddressModel = mongoose.model('address', addressSchema);

export default AddressModel;
