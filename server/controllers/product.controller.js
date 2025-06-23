import ProductModel from "../models/product.model.js";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import CategoryModel from "../models/category.model.js";
import { json } from "stream/consumers";
import HomepageSection from "../models/homepagesection.model.js";
import sharp from "sharp";

dotenv.config();

export const addreview = async (request, response) => {
  const { productid, rating, comment } = request.body;

  try {
    const product = await ProductModel.findById(productid);
    if (!product) {
      return response.status(404).json({ success: false, message: "Product not found" });
    }

    const review = {
      rating: Number(rating),
      comment,
      user: request.userId
    };

    console.log('This is review:', review);

    // Push the new review
    product.reviews.push(review);

    // Save the review
    await product.save();

    // ✅ Calculate and update the average rating
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = totalRating / product.reviews.length;

    // ✅ Update and save again with averageRating
    product.averageRating = average;
    await product.save();

    return response.status(200).json({ success: true, averageRating: average });

  } catch (error) {
    console.log(error);
    return response.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
export const getreviewsofproduct = async (request, response) => {
  const productid = request.params.id;
  const ratingsStats = await ProductModel.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(productid) } },
    { $unwind: "$reviews" },
    {
      $group: {
        _id: "$reviews.rating",
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: -1 } }, // Sort by star rating descending (5 to 1)
  ]);
  console.log("this is ratingsStats", ratingsStats);
  const product = await ProductModel.findById(productid).populate({
    path: "reviews.user", // Populate the 'user' field in each review
    select: "name avatar",
    // Only select 'name' and 'email' from the User model
  });

  return response.status(200).json({
    success: true,
    data: product.reviews,
    ratingsStats: ratingsStats,
    message: "Review fetched successfully",
    totalReviews: product.reviews.length,
  });
};

export const getallProduct = async (req, res) => {
  try {
    const product = await ProductModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: product,
      message: "Product retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve product",
      error: error.message,
    });
  }
};
export const createProductController = async (request, response) => {
  try {
    let {
      name,
      category,
      description,
      weightVariants,
      sku_code,
      shelf_life
    } = request.body;

     
    const imageBaseURL = process.env.VITE_API_URL;
    const uploadsDir = "uploads";

    // Convert and save cover image as WebP
    const coverImgOriginal = request.files.coverimage[0];
    const coverWebpFilename = `${Date.now()}-cover.webp`;
    const coverWebpPath = path.join(uploadsDir, coverWebpFilename);

    await sharp(coverImgOriginal.path)
      .webp({ quality: 80 })
      .toFile(coverWebpPath);

    // Delete original cover image
    fs.unlinkSync(coverImgOriginal.path);

    // ✅ Construct cover image URL with forward slashes
    const coverimage = `${imageBaseURL}/${uploadsDir}/${coverWebpFilename}`;

    // Convert each additional image to WebP
    let image = [];
    for (let index = 0; index < request.files.image.length; index++) {
      const imgFile = request.files.image[index];
      const webpFilename = `${Date.now()}-${index}-product.webp`;
      const webpPath = path.join(uploadsDir, webpFilename);

      await sharp(imgFile.path)
        .webp({ quality: 80 })
        .toFile(webpPath);

      // Delete original
      fs.unlinkSync(imgFile.path);

      // ✅ Construct image URL with forward slashes
      image.push(`${imageBaseURL}/${uploadsDir}/${webpFilename}`);
    }

    const parsedMoreDetails = JSON.parse(request.body.more_details);
    let wv = JSON.parse(weightVariants);

    wv.forEach((item) => {
      if (item.discount === "") {
        item.discount = 0;
      }
    });

    const product = new ProductModel({
      name,
      coverimage,
      image,
      category,
      description,
      more_details: parsedMoreDetails,
      weightVariants: wv || [],
      sku_code,
      shelf_life
    });

    const savedProduct = await product.save();

    return response.json({
      message: "Product created successfully",
      data: savedProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};


export const getProductController = async (request, response) => {
  try {
    let { page, limit, search } = request.body;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    // Search query with regex (only if 3+ characters are entered)
    const query =
      search && search.length >= 3
        ? { name: { $regex: search, $options: "i" } }
        : {};

    const skip = (page - 1) * limit;

    // Fetch data & count total products matching query
    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category"),
      ProductModel.countDocuments(query),
    ]);

    return response.json({
      message: "Product data",
      error: false,
      success: true,
      totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductByCategory = async (request, response) => {
  try {
    let { id, page, limit } = request.body;
    console.log("here is my category id in server")
    console.log(id)

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    
     if (!id) {
      return response.status(400).json({
        message: "provide category id",
        error: true,
        success: false,
      });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
         return response.status(404).json({
           message: "Category not found",
           error: true,
           success: false,
         });
       }
 const categoryExists = await CategoryModel.findById(id);
     if (!categoryExists) {
         return response.status(404).json({
           message: "Category not found",
           error: true,
           success: false,
         });
       }


    const totalCount =await ProductModel.countDocuments({
      category:{
        $in : [id]
      }
    })
    const skip = (page - 1) * limit;

    const product = await ProductModel.find({
      category: { $in: [id] },
    }).skip(skip)
      .limit(limit)
      .populate("category");

    return response.json({
      message: "category product list",
      data:{product,totalCount},
      error: false,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
export const getProductByCategoryName = async (request, response) => {
  try {
    let { page, limit, categoryName } = request.body;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    let query = {};

    // Check if categoryName is provided and if it's at least 3 characters long
    if (categoryName && categoryName.length >= 3) {
      // Attempt to find the category by its name (case-insensitive search)
      const category = await CategoryModel.findOne({
        name: { $regex: categoryName, $options: "i" }, // Case-insensitive search
      });

      // If category is found, filter products by categoryId
      if (category) {
        const categoryId = category._id;
        query.category = categoryId; // Add the category ID to the query
      } else {
        // If no category found, return empty data (no products for this category)
        return response.json({
          message: "No products found for this category.",
          error: false,
          success: true,
          totalCount: 0,
          totalNoPage: 0,
          data: [],
        });
      }
    }

    const skip = (page - 1) * limit;

    // Fetch products based on category query
    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category"),
      ProductModel.countDocuments(query),
    ]);

    return response.json({
      message: "Product data fetched by category name.",
      error: false,
      success: true,
      totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductDetails = async (request, response) => {
  try {
    const { productId } = request.body;
  if (!mongoose.Types.ObjectId.isValid(productId)) {
        return response.status(404).json({
          message: "Product not found",
          error: true,
          success: false,
        });
      }
    const product = await ProductModel.findOne({ _id: productId }).populate(
      "category"
    );


     if (!product) {
         return response.status(404).json({
           message: "Product not found",
           error: true,
           success: false,
         });
       }

    return response.json({
      message: "product details",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("this is error", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateProductDetails = async (request, response) => {
  try {
    const { _id } = request.body;

    if (!_id) {
      return response.status(400).json({
        message: "Provide product _id",
        error: true,
        success: false,
      });
    }

    const existingProduct = await ProductModel.findById(_id);
    if (!existingProduct) {
      return response.status(404).json({
        message: "Product not found",
        error: true,
        success: false,
      });
    }

    const imagefullpath = process.env.VITE_API_URL;
    const uploadsDir = 'uploads';

    const data = {
      name: request.body.name,
      category: request.body.category,
      description: request.body.description,
      more_details: JSON.parse(request.body.more_details),
      weightVariants: JSON.parse(request.body.weightVariants) || [],
      sku_code: request.body.sku_code,
      shelf_life: request.body.shelf_life,
    };

    // Handle existed images
    let newimages = [];
    let existedImage = [];

    if (request.body.existedImage !== undefined) {
      if (Array.isArray(request.body.existedImage)) {
        existedImage = request.body.existedImage;
      } else {
        existedImage.push(request.body.existedImage);
      }
    }

    newimages = [...existedImage];

    // 🔥 Delete removed images from the server
    const removedImages = existingProduct.image.filter((img) => !existedImage.includes(img));
    for (const imgUrl of removedImages) {
      const filePath = imgUrl.replace(`${imagefullpath}/`, '');
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Handle new images
    if (request.files?.image && request.files.image.length > 0) {
      for (let i = 0; i < request.files.image.length; i++) {
        const img = request.files.image[i];
        const webpFilename = `${Date.now()}-${i}-product.webp`;
        const webpPath = `${uploadsDir}/${webpFilename}`;

        await sharp(img.path)
          .webp({ quality: 80 })
          .toFile(webpPath);

        fs.unlinkSync(img.path); // remove original image

        newimages.push(`${imagefullpath}/${webpPath}`);
      }
    }

    data.image = newimages;

    // Handle cover image
    if (request.files?.coverimage && request.files.coverimage.length > 0) {
      const coverImgOriginal = request.files.coverimage[0];
      const coverWebpFilename = `${Date.now()}-cover.webp`;
      const coverWebpPath = `${uploadsDir}/${coverWebpFilename}`;

      await sharp(coverImgOriginal.path)
        .webp({ quality: 80 })
        .toFile(coverWebpPath);

      fs.unlinkSync(coverImgOriginal.path);

      // Delete old cover image if exists and different
      if (
        existingProduct.coverimage &&
        existingProduct.coverimage !== `${imagefullpath}/${coverWebpPath}`
      ) {
        const oldCoverPath = existingProduct.coverimage.replace(`${imagefullpath}/`, '');
        if (fs.existsSync(oldCoverPath)) {
          fs.unlinkSync(oldCoverPath);
        }
      }

      data.coverimage = `${imagefullpath}/${coverWebpPath}`;
    }

    // Update product
    const updateProduct = await ProductModel.updateOne({ _id }, data);

    return response.json({
      message: "Product updated successfully",
      data: updateProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("UpdateProduct Error:", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};


//delete product
export const deleteProductDetails = async (request, response) => {
  try {
    const { _id, image, coverimage } = request.body;
    console.log("this is", image);

    if (!_id) {
      return response.status(400).json({
        message: "provide _id ",
        error: true,
        success: false,
      });
    }
    if (fs.existsSync(image)) {
      console.log(image);
      fs.unlinkSync(image); // Deletes the image file
    }

    const deleteProduct = await ProductModel.deleteOne({ _id: _id });
    await HomepageSection.updateMany(
      { productIds: _id },
      { $pull: { productIds: _id } }
    );

    return response.json({
      message: "Delete successfully",
      error: false,
      success: true,
      data: deleteProduct,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//search product in SearchPage.jsx
export const searchProduct = async (request, response) => {
  try {
    let { search, page, limit } = request.body;

    if (!page) page = 1;
    if (!limit) limit = 10;

    const query = search
      ? { name: { $regex: search, $options: "i" } } // Change 'name' to the field you want to search
      : {};

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category"),
      ProductModel.countDocuments(query),
    ]);

    return response.json({
      message: "Product data",
      error: false,
      success: true,
      data: data,
      totalCount: dataCount,
      totalPage: Math.ceil(dataCount / limit),
      page: page,
      limit: limit,
    });
  } catch (error) {
    console.error("Error in searchProduct:", error);
    return response.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const getproductfilter = async (request, response) => {
  try {
    let {
      page,
      search,
      priceSort,
      weight,
      maxshelfLife,
      category,
      rating,
      minPrice,
      maxPrice,
    } = request.body;

    page = parseInt(page) || 1;
    let limit = 10;
    const skip = (page - 1) * limit;
    minPrice = parseInt(minPrice);
    maxPrice = parseInt(maxPrice);
    maxshelfLife = parseInt(maxshelfLife);

    const pipeline = [];

    let matchStage = {};

    if(maxshelfLife>0)
    matchStage.shelf_life = { $gte: maxshelfLife };

    if (category.length > 0) {
      const categoryIds = category.map((id) =>
        new mongoose.Types.ObjectId(id)
      );
      matchStage.category = { $in: categoryIds };
    }

    if (search && search.length >= 3) {
      matchStage.name = { $regex: search, $options: "i" };
    }

    pipeline.push({
      $match: matchStage,
    });

    console.log(pipeline);

    if (weight.length > 0) {
      pipeline.push({
        $addFields: {
          tempFilteredVariants: {
            $filter: {
              input: "$weightVariants",
              as: "variant",
              cond: { $in: ["$$variant.weight", weight] },
            },
          },
        },
      });

      pipeline.push({
        $match: {
          "tempFilteredVariants.0": { $exists: true },
        },
      });
    } else {
      pipeline.push({
        $addFields: {
          tempFilteredVariants: "$weightVariants",
        },
      });
    }

pipeline.push({
  $addFields: {
    variantsWithDiscountedPrice: {
      $map: {
        input: {
          $filter: {
            input: "$tempFilteredVariants",
            as: "variant",
            cond: {
              $let: {
                vars: {
                  discountedPrice: {
                    $subtract: [
                      "$$variant.price",
                      {
                        $divide: [
                          { $multiply: ["$$variant.price", "$$variant.discount"] },
                          100,
                        ],
                      },
                    ],
                  },
                },
                in: {
                  $and: [
                    { $gte: ["$$discountedPrice", minPrice] },
                    { $lte: ["$$discountedPrice", maxPrice] },
                  ],
                },
              },
            },
          },
        },
        as: "variant",
        in: {
          $subtract: [
            "$$variant.price",
            {
              $divide: [
                { $multiply: ["$$variant.price", "$$variant.discount"] },
                100,
              ],
            },
          ],
        },
      },
    },
  },
});


pipeline.push({
  $match: {
    variantsWithDiscountedPrice: { $ne: [] }
  }
});

    // Compute maxPrice from filtered or original
pipeline.push({
  $addFields: {
    minPrice: { $min: "$variantsWithDiscountedPrice" },
    maxPrice: { $max: "$variantsWithDiscountedPrice" },
  },
});



    const sortStage = {};

    if (priceSort === "desc") {
      sortStage.maxPrice = -1;
    }

    if(priceSort === "asc"){
      sortStage.minPrice = 1;
    }

    if (rating) {
      sortStage.averageRating = -1; // always descending
    }

    if (Object.keys(sortStage).length > 0) {
      pipeline.push({ $sort: sortStage });
    }

    pipeline.push({
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category"
      }
    });

    pipeline.push({
      $unwind: {
        path: "$category",
        preserveNullAndEmptyArrays: true
      }
    });

    pipeline.push({
      $project: {
        name: 1,
        coverimage: 1,
        image: 1,
        category: {
          _id: "$category._id",
          name: "$category.name",
          image: "$category.image",
          createdAt: "$category.createdAt",
          updatedAt: "$category.updatedAt"
        },
        description: 1,
        averageRating:1,
        publish: 1,
        sku_code: 1,
        weightVariants: 1,
        minPrice:1,
        maxPrice:1,
        createdAt: 1,
        updatedAt: 1
      },
    });

    const paginatedPipeline = [
      ...pipeline,
      { $skip: skip },
      { $limit: limit }
    ];

    const finalPipeline = [
      {
        $facet: {
          data: paginatedPipeline,
          totalCount: [
            ...pipeline,
            { $count: "count" }
          ]
        }
      }
    ];

    const result = await ProductModel.aggregate(finalPipeline);
    const data = result[0].data;
    const totalCount = result[0].totalCount[0]?.count || 0;
    return response.json({
      message: "Product data",
      error: false,
      success: true,
      totalCount,
      // totalNoPage: Math.ceil(totalCount / limit),
      data,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};
