import { admin } from '../middleware/Admin.js';
import auth from '../middleware/auth.js';
import { Router } from 'express';
import { 
  addUser, 
  getUsers, 
  updateUser, 
  deleteUser, 
  setPassword, 
  userDetails,
  loginController
} from '../controllers/Admin.controller.js';

const adminRouter = Router();

// User routes
adminRouter.post('/login', loginController);
adminRouter.post('/add', auth, admin, addUser);
adminRouter.get('/list', auth, admin, getUsers);
adminRouter.put('/update', auth, admin, updateUser);
adminRouter.get('/user-details',auth,userDetails)

adminRouter.delete('/delete/:id', auth, admin, deleteUser);

// New route for setting a password
adminRouter.post('/set-password/:userId', setPassword);


export default adminRouter;
