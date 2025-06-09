import { admin } from '../middleware/Admin.js';
import auth from '../middleware/auth.js';
import { Router } from 'express';


import { addWeightVariant, listWeightVariants, updateWeightVariant,deleteWeightVariant} from '../controllers/weightvariant.controller.js';
const weightvariantRouter = Router();


weightvariantRouter.post('/addweight', auth,addWeightVariant);  
weightvariantRouter.get('/listweight', listWeightVariants); 
weightvariantRouter.put('/updateweight', auth,  updateWeightVariant);
weightvariantRouter.delete('/deleteweight', auth,  deleteWeightVariant);
export default weightvariantRouter;
