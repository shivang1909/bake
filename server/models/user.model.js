import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    weight: {
      type: Number, // e.g., "250g", "500g"
      required: true,
    },
    cartQty: {
      type: Number, // Quantity of the selected variant in the cart
      default: 1,
    },
  },
  { _id: false } // Prevents Mongoose from adding an automatic _id field for each variant
);

const shoppingCartSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.ObjectId,
      ref: "product",
    },
    variants: [variantSchema],
  },
  { _id: false } // Prevents Mongoose from adding an automatic _id field for each shopping cart item
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide name"],
    },
    email: {
      type: String,
      required: [true, "Provide email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Provide password"],
    },
    avatar: {
      type: String,
      default: "",
    },
    mobile: {
      type: Number,
      default: null,
    },
    refresh_token: {
      type: String,
      default: "",
    },
    verify_email: {
      type: Boolean,
      default: false,
    },
    last_login_date: {
      type: Date,
      default: "",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    address_details: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "address",
      },
    ],
    shopping_cart: [shoppingCartSchema], // Using the schema without _id
    forgot_password_otp: {
      type: String,
      default: null,
    },
    forgot_password_expiry: {
      type: Date,
      default: "",
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
