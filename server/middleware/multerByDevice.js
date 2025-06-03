import multer from 'multer';
import path from 'path';
import fs from 'fs';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const deviceType = req.query.deviceType;  // Get deviceType from query instead of body
    if (!deviceType || !['mobile', 'laptop'].includes(deviceType)) {
      return cb(new Error('Invalid or missing deviceType'));
    }
    const uploadPath = path.join(process.cwd(), 'uploads', deviceType);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const uploadByDevice = multer({ storage });
export default uploadByDevice;
