import CategoryModel from "../models/category.model.js";
import ProductModel from "../models/product.model.js";
import fs from "fs"

export const  AddCategoryController = async(request,response)=>{
    try {
        const { name } = request.body 
        const image = `uploads/` +request.file.filename // Only extract the filename or path
            
       console.log("this is image"+ request.file);
         
        if(!name || !image){
            return response.status(400).json({
                message : "Enter required fields",
                error : true,
                success : false
            })
        }

        const addCategory = new CategoryModel({
            name,
            image
        })

        const saveCategory = await addCategory.save()

        if(!saveCategory){
            return response.status(500).json({
                message : "Not Created",
                error : true,
                success : false
            })
        }

        return response.json({
            message : "Add Category",
            data : saveCategory,
            success : true,
            error : false
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const getCategoryController = async(request,response)=>{
    try {
        
        const data = await CategoryModel.find().sort({ createdAt : -1 })
   
        return response.json({
            data : data,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.messsage || error,
            error : true,
            success : false
        })
    }
}


export const getCategoryByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryModel.findById(id); 

        if (!category) {
            return res.status(404).json({ success: false, message: "Category not found" });
        }
        // console.log("Category name:", category.name);
        
        res.json({ success: true, data: category.name }); // Sending only category name
    } catch (error) {
        console.error("Error fetching category:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const updateCategoryController = async (request, response) => {
    try {
        console.log("_------------------------------------");

        const { name, _id,image } = request.body;
        console.log(`name ${name}`);

        let imagePath = image;  // Default value for imagePath

        // Check if a file is uploaded
        if (request.file) {
            imagePath = `uploads/`+request.file.filename; // Set the imagePath to the uploaded file's path
        }

        console.log(`image path is ${request.file}`);

        // Update the category in the database
        const update = await CategoryModel.updateOne(
            { _id: _id },
            {
                name: name,
                image: imagePath, // Save the image path if available
            }
        );

        return response.json({
            message: "Updated Category",
            success: true,
            data: update,
        });
    } catch (error) {
        console.error('Error details:', error);
        return response.status(500).json({
            message: error.message || "An error occurred",
            success: false,
        });
    }
};


export const deleteCategoryController = async(request,response)=>{
    try {
        const { _id,image } = request.body 
        //Image Delete  Logic 
        
        if (fs.existsSync(image)) {
            console.log(image);
            fs.unlinkSync(image); // Deletes the image file
        }


        const checkProduct = await ProductModel.find({
            category : {
                "$in" : [ _id ]
            }
        }).countDocuments()

        if(checkProduct > 0 ){
            return response.status(400).json({
                message : "Category is already use can't delete",
                error : true,
                success : false
            })
        }

        const deleteCategory = await CategoryModel.deleteOne({ _id : _id})

        return response.json({
            message : "Delete category successfully",
            data : deleteCategory,
            error : false,
            success : true
        })

    } catch (error) {
       return response.status(500).json({
            message : error.message || error,
            success : false,
            error : true
       }) 
    }
}