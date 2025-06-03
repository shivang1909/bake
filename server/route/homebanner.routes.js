import { Router } from 'express';
import auth from '../middleware/auth.js';
import { admin } from '../middleware/Admin.js';


import {
  addHomeBanner,
  getHomeBanners,
  updateBannerStatus,
  deleteBannerImage
} from '../controllers/homebanner.controller.js';
import uploadByDevice from '../middleware/multerByDevice.js';


const homeBannerRouter = Router();


// Add a new banner image (mobile/laptop)
homeBannerRouter.post('/addbanner', auth, admin, uploadByDevice.single('image'), addHomeBanner);


// Get all banners (grouped by mobile/laptop)
homeBannerRouter.get('/getbanners', getHomeBanners);


// Update banner image status (active/inactive)
homeBannerRouter.put('/updatestatus', auth, admin, updateBannerStatus);


// Delete a specific banner image
homeBannerRouter.delete('/deletebanner', auth, admin, deleteBannerImage);


export default homeBannerRouter;
