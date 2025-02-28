import { Router } from 'express';
import { 
  getAllPromocodes, 
  createPromocode, 
  updatePromocode, 
  deletePromocode, 
  verifyPromocode, 
  getFilterdPromocodes
//   applyPromocode 
} from '../controllers/promocode.controller.js';
// import { verifyToken, isAdmin } from '../middlewares/auth.js';
import auth from '../middleware/auth.js'

const promocodeRouter = Router();

// Get all promocodes - Admin only
promocodeRouter.get('/promocode', auth, getAllPromocodes);

promocodeRouter.post('/promocode/applicable', auth, getFilterdPromocodes);

 
// Create new promocode - Admin only
promocodeRouter.post('/promocode', auth, createPromocode);

// Update promocode - Admin only
promocodeRouter.put('/promocode', auth, updatePromocode);

// Delete promocode - Admin only
promocodeRouter.delete('/promocode/:id', auth, deletePromocode);

// Verify promocode - Any authenticated user
promocodeRouter.post('/promocode/verify', auth, verifyPromocode);

// Apply promocode - Any authenticated user
// promocodeRouter.post('/apply', auth, applyPromocode);

export default promocodeRouter;
