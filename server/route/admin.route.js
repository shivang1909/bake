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
} from '../controllers/admin.controller.js';
import { 
  getHomepageSections,
  createHomepageSection,
  deletehomepageSection,
  updatehomepageSection
} from '../controllers/Homepagesection.js';
const adminRouter = Router();

// User routes
adminRouter.post('/login', loginController);
adminRouter.post('/add', auth, admin, addUser);
adminRouter.get('/list', auth, admin, getUsers);
adminRouter.put('/update/:id', auth, admin, updateUser);
adminRouter.put('/update-admin', auth,admin,updateUser);
adminRouter.get('/user-details',auth,userDetails)
adminRouter.get('/homepage-sections', getHomepageSections); 
adminRouter.delete('/delete/:id', auth, admin, deleteUser);
adminRouter.post('/create-homepage-section', createHomepageSection);
adminRouter.delete('/delete-homepage-section', auth, admin, deletehomepageSection);
adminRouter.put('/update-homepage-section', auth, admin, updatehomepageSection); // Assuming you have an update function for homepage sections
// New route for setting a password
adminRouter.post('/set-password/:userId', setPassword);


export default adminRouter;
