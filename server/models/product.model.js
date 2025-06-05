import mongoose from "mongoose";

const weightVariantSchema = new mongoose.Schema({
    weight: {
        type: String, // e.g., "500g", "1kg"
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    qty: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number, // Discount for the specific weight variant
        default: 0,   // Default discount is 0
    },
});
const reviewSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // reference to the User model
    },
    rating: {
      type: Number,
     
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {_id:false}

);
  

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        coverimage: {
            type: String,
            default: "",
        },
        image: {
            type: Array,
            default: [],
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "category",
        },
        description: {
            type: String,
            default: "",
        },
        more_details: {
            type: Object,
            default: {},
        },
        weightVariants: [weightVariantSchema], // Array of weight variants with discount
        publish: {
            type: Boolean,
            default: true,
        },
        sku_code: {
            type: String,
            required: true,
        },
        shelf_life: {
            type: Number,
            required: true, // Shelf life in days
        },
        reviews: [reviewSchema], 
        averageRating: {
            type: Number,
            default:0,
      },
    },
    {
        timestamps: true,
    }
);

// Create a text index for search functionality
productSchema.index(
    {
        name: "text",
        description: "text",
    },
    {
        name: 10,
        description: 5,
    }
);

const ProductModel = mongoose.model("product", productSchema);

export default ProductModel;

// import mongoose from "mongoose";


// // Sub-schema to store per-product variant info
// const productWeightVariantSchema = new mongoose.Schema(
//   {
//     variant: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "weightvariant", // References global variant
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     discount: {
//       type: Number,
//       default: 0,
//     },
//   },
//   { _id: false }
// );

// const reviewSchema = new mongoose.Schema({
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User', // reference to the User model
//     },
//     rating: {
//       type: Number,
     
//       min: 1,
//       max: 5
//     },
//     comment: {
//       type: String,
//       trim: true
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now
//     }
//   },
//   {_id:false}

// );
  

// const productSchema = new mongoose.Schema(
//     {
//         name: {
//             type: String,
//             required: true,
//         },
//         coverimage: {
//             type: String,
//             default: "",
//         },
//         image: {
//             type: Array,
//             default: [],
//         },
//         category: {
//             type: mongoose.Schema.ObjectId,
//             ref: "category",
//         },
//         description: {
//             type: String,
//             default: "",
//         },
//         more_details: {
//             type: Object,
//             default: {},
//         },
//         weightVariants: [productWeightVariantSchema], // Array of weight variants with discount
//         publish: {
//             type: Boolean,
//             default: true,
//         },
//         sku_code: {
//             type: String,
//             required: true,
//         },
//         reviews: [reviewSchema], 
//     },
//     {
//         timestamps: true,
//     }
// );

// // Create a text index for search functionality
// productSchema.index(
//     {
//         name: "text",
//         description: "text",
//     },
//     {
//         name: 10,
//         description: 5,
//     }
// );

// const ProductModel = mongoose.model("product", productSchema);

// export default ProductModel;