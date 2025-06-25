import HomepageSection from "../models/homepagesection.model.js";
import ProductModel from "../models/product.model.js";
import product from "../models/product.model.js";

const GetHomePageSectionProducts = async (req, res) => {
  const sectionId = req.params.sectionId;
  const section = await HomepageSection.findById(sectionId)
    .populate("productIds")
    .lean(); // Optional: returns plain JS object

  if (!section) {
    return { error: "Section not found" };
  }
  console.log(section);
  res.status(200).json(section);
};

const getHomepageSections = async (req, res) => {
  const shouldPopulate = req.originalUrl === "/api/product/get-HomepageSection";

  try {
    const query = HomepageSection.find({ visible: true });

    if (shouldPopulate) {
      query.populate({
        path: "productIds",
        model: "product", // This explicitly tells Mongoose to use the "Product" model
        options: { limit: 5 },
      });
    }
    const sections = await query;
    res.status(200).json(sections);
  } catch (error) {
    console.log("Error fetching sections:", error);
    res.status(500).json({ message: "Error fetching sections" });
  }
};
const updatehomepageSection = async (req, res) => {
  try {
    console.log("body", req.body);
    const { sectionId, sectionName, productIds, visible } = req.body;

    // Validate required fields
    if (!sectionId || !sectionName) {
      console.log("Section not found:", sectionId);
      return res
        .status(400)
        .json({ message: "Section ID and name are required." });
    }

    const updatedSection = await HomepageSection.findByIdAndUpdate(
      sectionId,
      { sectionName, productIds, visible },
      { new: true }
    );

    if (!updatedSection) {
      return res.status(404).json({ message: "Section not found." });
    }
    res.status(200).json({ updatedSection, success: true });
  } catch (error) {
    console.log("Error updating homepage section:", error);
    res.status(500).json({ message: "Failed to update section" });
  }
};
const deletehomepageSection = async (req, res) => {
  try {
    const { sectionId } = req.body;

    if (!sectionId) {
      return res.status(400).json({ message: "Section ID is required." });
    }

    const deletedSection = await HomepageSection.findByIdAndDelete(sectionId);

    if (!deletedSection) {
      return res.status(404).json({ message: "Section not found." });
    }

    res
      .status(200)
      .json({ message: "Section deleted successfully.", success: true });
  } catch (error) {
    console.error("Error deleting homepage section:", error);
    res.status(500).json({ message: "Failed to delete section" });
  }
};

const createHomepageSection = async (req, res) => {
  try {
    const { sectionName, productIds, visible } = req.body;

    // Validate required fields
    if (!sectionName) {
      return res.status(400).json({ message: "Section name is required." });
    }

    const newSection = new HomepageSection({
      sectionName,
      productIds: productIds || [],
      visible: visible !== undefined ? visible : true,
    });

    const savedSection = await newSection.save();
    res.status(201).json(savedSection);
  } catch (error) {
    console.error("Error creating homepage section:", error);
    res.status(500).json({ message: "Failed to create section" });
  }
};

export const getProductByHomePageSection = async (req, res) => {
  try {
    var { sectionId, page, limit } = req.body;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    console.log("this is section id", request.body);
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return res.status(404).json({
        message: "No products found for this section",
        error: true,
        success: false,
      });
    }

    if (!sectionId) {
      console.log(sectionId);

      return res.status(400).json({
        message: "Section ID is required",
        error: true,
        success: false,
      });
    }

    const section = await HomepageSection.findById(sectionId).lean();

    if (!section || !section.productIds || section.productIds.length === 0) {
      return res.json({
        message: "No products found for this section.",
        error: false,
        success: true,
        totalCount: 0,
        totalNoPage: 0,
        data: [],
      });
    }

    const totalCount = section.productIds.length;
    const skip = (page - 1) * limit;

    const paginatedProductIds = section.productIds.slice(skip, skip + limit);
    console.log("this is paginatedProductIds", paginatedProductIds);
    const products = await ProductModel.find({
      _id: { $in: paginatedProductIds },
    })
      // optional: populate category if needed
      .sort({ createdAt: -1 }); // sort if required
    console.log("this is products", products);

    return res.json({
      message: "Products fetched by section",
      error: false,
      success: true,
      totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export {
  GetHomePageSectionProducts,
  getHomepageSections,
  createHomepageSection,
  deletehomepageSection,
  updatehomepageSection,
};
