import ProductModel from "../models/product.model.js";
import path from 'path';
import fs from 'fs';
import mongoose from 'mongoose';
import dotenv from 'dotenv'

dotenv.config();
export const createProductController = async (request, response) => {
    try {
        let {
            name,
            category,
            discount,
            description,
            weightVariants, // Added weightVariants here
            sku_code,
        } = request.body;

        let imagefullpath = process.env.VITE_API_URL;
        let coverimage = imagefullpath + '/' + 'uploads/' + request.files.coverimage[0].filename;

        let more_details = JSON.parse(request.body.more_details);
        let image = [];
        for (let index = 0; index < request.files.image.length; index++) {
            image[index] = imagefullpath + `/` + `uploads/` + request.files.image[index].filename;
        }

        // Create a new product with the provided data, including weightVariants
        const product = new ProductModel({
            name,
            coverimage,
            image,
            category,
            discount,
            description,
            more_details,
            weightVariants: JSON.parse(weightVariants) || [], // Handling weightVariants as an array
            sku_code
        });

        // Save the product to the database
        const savedProduct = await product.save();

        return response.json({
            message: "Product created successfully",
            data: savedProduct,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};
export const getProductController = async (request, response) => {
    try {
        let { page, limit, search } = request.body;

        if (!page) {
            page = 1;
        }

        if (!limit) {
            limit = 10;
        }

        const query = search ? {
            $text: {
                $search: search
            }
        } : {};

        const skip = (page - 1) * limit;

        const [data, totalCount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('category'),
            ProductModel.countDocuments(query)
        ]);

        return response.json({
            message: "Product data",
            error: false,
            success: true,
            totalCount: totalCount,
            totalNoPage: Math.ceil(totalCount / limit),
            data: data
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

export const getProductByCategory = async(request,response)=>{
    try {
        const { id } = request.body 

        if(!id){
            return response.status(400).json({
                message : "provide category id",
                error : true,
                success : false
            })
        }

        const product = await ProductModel.find({ 
            category : { $in : id }
        }).limit(15)

        return response.json({
            message : "category product list",
            data : product,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


export const getProductDetails = async(request,response)=>{
    try {
        const { productId } = request.body 

        const product = await ProductModel.findOne({ _id : productId })


        return response.json({
            message : "product details",
            data : product,
            error : false,
            success : true
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export const updateProductDetails = async (request, response) => {
    try {
        const { _id } = request.body; // Get weightVariants from the request

        if (!_id) {
            return response.status(400).json({
                message: "Provide product _id",
                error: true,
                success: false
            });
        }

        const data = {
            name: request.body.name,
            category: request.body.category,
            discount: request.body.discount,
            description: request.body.description,
            more_details: JSON.parse(request.body.more_details),
            weightVariants: JSON.parse(request.body.weightVariants) || [], // Handling weightVariants as an array
            sku_code: request.body.sku_code
        };
        console.log(data);
        
        // Handling file uploads
        let imagefullpath = process.env.VITE_API_URL;
        // let coverimage = imagefullpath + '/' + 'uploads/' + request.files.coverimage[0].filename;

        let newimages=[];
        if (request.body.existedImage === undefined) {
            newimages = [];
        }  
        else{
            let existedImage ;
             if(Array.isArray(request.body.existedImage)){
                existedImage = request.body.existedImage; 
            }
            else
            {
                 existedImage = [];
                existedImage.push(request.body.existedImage);

            }
            console.log(`existedimage ${request.body.existedImage}`);
            newimages=[...newimages,...existedImage];
        }

        if (request.files.image && request.files.image.length > 0) {
            for (let index = 0; index < request.files.image.length; index++) {
                newimages.push(imagefullpath + '/uploads/' + request.files.image[index].filename);
            }
        }

        data.image = newimages;

        if(Array.isArray(request.files.coverimage)){
            data.coverimage =  imagefullpath + '/' + 'uploads/' + request.files.coverimage[0].filename;
        }

        // Update the product details in the database
        const updateProduct = await ProductModel.updateOne({ _id: _id }, data);

        // const updateProduct = await ProductModel.updateOne(
        //     { _id: _id },
        //     { $set: { ...data } } // Using $set to update only the provided fields
        // );
        return response.json({
            message: "Product updated successfully",
            data: updateProduct,
            error: false,
            success: true
        });
    } catch (error) {
        console.log(error);
        
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
};

//delete product
export const deleteProductDetails = async(request,response)=>{
    try {
        const { _id,image,coverimage} = request.body 
       console.log('this is',image);

        if(!_id){
            return response.status(400).json({
                message : "provide _id ",
                error : true,
                success : false
            })
        }
        if (fs.existsSync(image)) {
                    console.log(image);
                    fs.unlinkSync(image); // Deletes the image file
                }

        const deleteProduct = await ProductModel.deleteOne({_id : _id })

        return response.json({
            message : "Delete successfully",
            error : false,
            success : true,
            data : deleteProduct
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

//search product
export const searchProduct = async(request,response)=>{
    try {
        let { search, page , limit } = request.body 

        if(!page){
            page = 1
        }
        if(!limit){
            limit  = 10
        }

        const query = search ? {
            $text : {
                $search : search
            }
        } : {}

        const skip = ( page - 1) * limit

        const [data,dataCount] = await Promise.all([
            ProductModel.find(query).sort({ createdAt  : -1 }).skip(skip).limit(limit).populate('category'),
            ProductModel.countDocuments(query)
        ])

        return response.json({
            message : "Product data",
            error : false,
            success : true,
            data : data,
            totalCount :dataCount,
            totalPage : Math.ceil(dataCount/limit),
            page : page,
            limit : limit 
        })


    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


