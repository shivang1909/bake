import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
  AddCategoryController,
  deleteCategoryController,
  getCategoryController,
  updateCategoryController,
  getCategoryByIdController, // Import new controller
} from '../controllers/category.controller.js';
import upload from '../middleware/multer.js';

const categoryRouter = Router();

categoryRouter.post('/add-category', auth, upload.single('image'), AddCategoryController);
categoryRouter.get('/get', getCategoryController);
categoryRouter.get('/:id', getCategoryByIdController); // New route to get category name
categoryRouter.put('/update', auth, upload.single('image'), updateCategoryController);
categoryRouter.delete('/delete', auth, deleteCategoryController);

export default categoryRouter;
