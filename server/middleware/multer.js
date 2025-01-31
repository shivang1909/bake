import multer from 'multer'
import path from "path" 
import fs from "fs"
import { request } from 'http';


const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Save files in the "uploads" folder
    },
    filename: (req, file, cb) => {
        console.log("-------------------------")
        console.log(file.originalname)
        const uniqueSuffix = `${file.originalname}`;
        cb(null, uniqueSuffix); // Set a unique name for the file
    },
});

const upload = multer({ storage });

export default upload