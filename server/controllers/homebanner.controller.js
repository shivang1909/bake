import BannerModel from '../models/homebanner.model.js';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export const addHomeBanner = async (req, res) => {
  try {
    const { deviceType } = req.body;


    if (!req.file || !deviceType || !['mobile', 'laptop'].includes(deviceType)) {
      return res.status(400).json({
        success: false,
        message: 'Image file and valid deviceType (mobile/laptop) are required',
      });
    }


    const uploadFolder = `uploads/${deviceType}`;
    const originalPath = req.file.path;


    // Generate timestamp-based filename
    const timestamp = Date.now();
    const webpFileName = `banner-${timestamp}.webp`;
    const webpOutputPath = path.join(uploadFolder, webpFileName);


    // Convert original to webp
    await sharp(originalPath)
      .webp({ quality: 80 })
      .toFile(webpOutputPath);


    // Remove original non-webp file
    fs.unlinkSync(originalPath);


    const relativePath = `${uploadFolder}/${webpFileName}`;
    let bannerDoc = await BannerModel.findOne();


    const bannerObject = {
      imageUrl: relativePath,
      deviceType,
      status: 'inactive'
    };


    if (!bannerDoc) {
      bannerDoc = new BannerModel({
        mobileBanners: [],
        laptopBanners: []
      });
    }


    if (deviceType === 'mobile') {
      bannerDoc.mobileBanners.push(bannerObject);
    } else {
      bannerDoc.laptopBanners.push(bannerObject);
    }


    await bannerDoc.save();


    res.status(201).json({
      success: true,
      message: 'Banner uploaded and converted to .webp successfully',
      data: bannerObject
    });


  } catch (error) {
    console.error("Banner upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Get all banners
export const getHomeBanners = async (req, res) => {
  try {
    const bannerDoc = await BannerModel.findOne();
    if (!bannerDoc) {
      return res.status(200).json({
        success: true,
        message: 'No banners found',
        data: {
          mobileBanners: [],
          laptopBanners: []
        }
      });
    }


    res.status(200).json({
      success: true,
      message: 'Banners retrieved successfully',
      data: {
        mobileBanners: bannerDoc.mobileBanners,
        laptopBanners: bannerDoc.laptopBanners
      }
    });
  } catch (error) {
    console.log("errror",error);
   
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ Update status (active/inactive)
export const updateBannerStatus = async (req, res) => {
  try {
    const { bannerId, deviceType, status } = req.body;


    if (!bannerId || !['mobile', 'laptop'].includes(deviceType) || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'bannerId, deviceType, and valid status are required'
      });
    }


    const bannerDoc = await BannerModel.findOne();
    if (!bannerDoc) throw new Error('No banner document found');


    const banners = deviceType === 'mobile' ? bannerDoc.mobileBanners : bannerDoc.laptopBanners;
    const banner = banners.id(bannerId);


    if (!banner) throw new Error('Banner not found');


    // ✅ If trying to activate, check if already 5 active banners exist
    if (status === 'active') {
      const activeCount = banners.filter(b => b.status === 'active').length;
      if (activeCount >= 5) {
        return res.status(400).json({
          success: false,
          message: 'Only 5 active banners allowed per device type'
        });
      }
    }


    // Update status
    banner.status = status;


    await bannerDoc.save();


    res.status(200).json({
      success: true,
      message: 'Banner status updated',
      data: banner
    });
  } catch (error) {
    console.log("error",error);
   
    res.status(500).json({ success: false, message: error.message });
  }
};




// ✅ Delete banner
export const deleteBannerImage = async (req, res) => {
  try {
    const { bannerId, deviceType } = req.body;


    if (!bannerId || !['mobile', 'laptop'].includes(deviceType)) {
      return res.status(400).json({
        success: false,
        message: 'bannerId and valid deviceType are required'
      });
    }


    const bannerDoc = await BannerModel.findOne();
    if (!bannerDoc) throw new Error('No banner document found');


    const banners = deviceType === 'mobile' ? bannerDoc.mobileBanners : bannerDoc.laptopBanners;
    const index = banners.findIndex(b => b._id.toString() === bannerId);


    if (index === -1) throw new Error('Banner not found');


    // Delete file from system
    const relativePath = banners[index].imageUrl;
    const fullPath = path.join('public', relativePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }


    // Remove banner
    banners.splice(index, 1);
    await bannerDoc.save();


    res.status(200).json({
      success: true,
      message: 'Banner image deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
