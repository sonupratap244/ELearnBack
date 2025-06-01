import multer from "multer";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";

// Define storage strategy
const storage = multer.diskStorage({
    destination(req, file, cb) {
        const uploadDir = "uploads";

        // Create uploads folder if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },

    filename(req, file, cb) {
        const id = uuid(); // Unique ID
        const extName = path.extname(file.originalname); // Extract extension
        const fileName = `${id}${extName}`; // Final file name

        cb(null, fileName);
    }
});

// Export upload middleware (single file, field name = 'file')
export const uploadFiles = multer({ storage }).single("file");
