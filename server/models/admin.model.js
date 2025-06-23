import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: Number, default: null },
  avatar: { type: String, default: "" },
  paymentReceived: { type: Number, default: 0 },
  role: { type: String, required: true },
  password: { type: String },
  isPasswordSet: { type: Boolean, default: false },
  last_login_date: { type: Date, default: "" },

  // 🔐 OTP-based password reset
  otp: {
    type: String,
    default: ""
  },
  otpExpiry: {
    type: Date,
    default: null
  }

}, { timestamps: true });

const AdminModel = mongoose.model('Admin', adminSchema);

export default AdminModel;
