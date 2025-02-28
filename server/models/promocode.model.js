import mongoose from 'mongoose';

const promocodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    minOrderValue: {
      type: Number,
      required: true,
      min: 0,
    },
    usageLimit: {
      type: Number,
      required: true,
      min: 1,
    },
    discountType: {
      type: String,
      enum: ['fixed', 'percentage'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },
    maxDiscount: {
      type: Number,
      required: true,
      min: 0,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    users: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

const Promocode = mongoose.model('promocode', promocodeSchema);

export default Promocode;
