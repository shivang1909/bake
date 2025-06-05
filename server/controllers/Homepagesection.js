import HomepageSection from "../models/homepagesection.model.js";
import product from "../models/product.model.js";

const GetHomePageSectionProducts = async(req,res)=>{
  const sectionId = req.params.sectionId
  const section = await HomepageSection.findById(sectionId)
      .populate('productIds')
      .lean(); // Optional: returns plain JS object

      if (!section) {
        return { error: 'Section not found' };
      }
      console.log(section)
   res.status(200).json(section)
}

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
export {
  GetHomePageSectionProducts,
  getHomepageSections,
  createHomepageSection,
  deletehomepageSection,
  updatehomepageSection,
};
