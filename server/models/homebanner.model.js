import mongoose from "mongoose";


const bannerImageSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true
    },
    deviceType: {
      type: String,
      enum: ['mobile', 'laptop'],
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'inactive', // Change to 'active' if desired by default
      required: true,
    },
  }
);


const homeBannerSchema = new mongoose.Schema(
  {
    mobileBanners: [bannerImageSchema],
    laptopBanners: [bannerImageSchema],
    createdAt: { type: Date, default: Date.now },
  }
);


export default mongoose.model("HomeBanner", homeBannerSchema);