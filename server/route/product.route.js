import { Router } from 'express'
import auth from '../middleware/auth.js'
import {addreview, createProductController, deleteProductDetails, getProductByCategory, getProductController, getProductDetails, searchProduct, updateProductDetails ,getProductByCategoryName, getreviewsofproduct, getproductfilter} from '../controllers/product.controller.js'
import { admin } from '../middleware/Admin.js'
import upload from "../middleware/multer.js";
import { getallProduct } from '../controllers/product.controller.js'
import { getHomepageSections, getProductByHomePageSection } from '../controllers/Homepagesection.js';
import { GetHomePageSectionProducts } from '../controllers/Homepagesection.js';

const productRouter = Router()

productRouter.post("/create", upload.fields([{ name: "coverimage", maxCount: 1 }, { name: "image", maxCount: 10 }]), auth, admin, createProductController);

// productRouter.post("/create",upload.array("image",10),auth,admin,createProductController)
productRouter.post('/get',getProductController)
productRouter.post("/get-product-by-category",getProductByCategory)

//search product by category name in productAdmin.jsx
productRouter.post("/get-product-by-categoryname",getProductByCategoryName)

productRouter.post('/get-product-details',getProductDetails)

//update product route
productRouter.put('/update-product-details',auth,admin, upload.fields([{ name: "coverimage", maxCount: 1 }, { name: "image", maxCount: 10 }]),updateProductDetails)

//delete product
productRouter.delete('/delete-product',auth,admin,deleteProductDetails)

//search product 
productRouter.post('/search-product',searchProduct)
productRouter.post('/addreview',auth,addreview);
productRouter.get('/getreviewproduct/:id',auth,getreviewsofproduct);
productRouter.get('/get-all-product',auth,admin,getallProduct)
productRouter.get('/get-HomepageSection',getHomepageSections)
productRouter.get('/getProductByHomePageSection/:sectionId',GetHomePageSectionProducts)
productRouter.post('/getProductByHomePageSection',getProductByHomePageSection)
productRouter.post('/getfilterproduct',getproductfilter)

export default productRouter