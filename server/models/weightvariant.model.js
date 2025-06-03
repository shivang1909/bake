// models/WeightVariant.js
import mongoose from "mongoose";

const weightVariantSchema = new mongoose.Schema(
  {
    weight: {
      type: String, // "500g", "1kg", etc.
      required: true,
      
    },
    giftwrapCharge: {
      type: Number,
      
    },
  },
  {
    timestamps: true,
  }
);

const WeightVariantModel = mongoose.model("weightvariant", weightVariantSchema);

export default WeightVariantModel;
