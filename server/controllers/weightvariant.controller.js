import WeightVariantModel from "../models/weightvariant.model.js";
import mongoose from "mongoose";
export const addWeightVariant = async (req, res) => {
    try {
        const { weight, giftwrapCharge } = req.body;
        console.log(req.body)
        // Validate input
        if (!weight ) {
            return res.status(400).json({
                message: "Weight and gift wrap charge are required",
                error: true,
                success: false,
            });
        }

        // Create a new weight variant
        const newWeightVariant = new WeightVariantModel({
            weight,
            giftwrapCharge,
        });

        // Save the weight variant to the database
        await newWeightVariant.save();

        return res.status(201).json({
            message: "Weight variant added successfully",
            data: newWeightVariant,
            error: false,
            success: true,
        });
    } catch (error) {
        console.log("Error adding weight variant:", error);
        return res.status(500).json({
            message: "Error adding weight variant",
            error: true,
            success: false,
        });
    }
}
export const listWeightVariants = async (req, res) => {
    try {
        const weightVariants = await WeightVariantModel.find();

        return res.status(200).json({
            message: "Weight variants retrieved successfully",
            data: weightVariants,
            error: false,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error retrieving weight variants",
            error: true,
            success: false,
        });
    }
}
export const deleteWeightVariant = async (req, res) => {
    try {
        const { id } = req.body;

        // Validate input
        if (!id) {
            return res.status(400).json({
                message: "ID is required",
                error: true,
                success: false,
            });
        }
   console.log(id)
        // Find the weight variant by ID
      let weightVariant = await WeightVariantModel.findById(id);

        console.log(weightVariant)
        if (!weightVariant) {
            return res.status(404).json({
                message: "Weight variant not found",
                error: true,
                success: false,
            });
        }
        
         weightVariant = await WeightVariantModel.deleteOne({_id : id })
        // Delete the weight variant
    

        return res.status(200).json({
            message: "Weight variant deleted successfully",
            data: weightVariant,
            error: false,
            success: true,
        });
    } catch (error) {
        console.log("Error deleting weight variant:", error);
        return res.status(500).json({
            message: "Error deleting weight variant",
            error: true,
            success: false,
        });
    }
}

export const updateWeightVariant = async (req, res) => {
    try {
        const { id, weight, giftwrapCharge } = req.body;

        // Validate input
        if (!id || !weight) {
            return res.status(400).json({
                message: "ID and weight are required",
                error: true,
                success: false,
            });
        }

        // Find the weight variant by ID
        const weightVariant = await WeightVariantModel.findById(id);

        if (!weightVariant) {
            return res.status(404).json({
                message: "Weight variant not found",
                error: true,
                success: false,
            });
        }

        // Update the weight variant
        weightVariant.weight = weight;
        weightVariant.giftwrapCharge = giftwrapCharge;

        // Save the updated weight variant to the database
        await weightVariant.save();

        return res.status(200).json({
            message: "Weight variant updated successfully",
            data: weightVariant,
            error: false,
            success: true,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating weight variant",
            error: true,
            success: false,
        });
    }
}