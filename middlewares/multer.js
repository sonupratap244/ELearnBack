// import multer from "multer";
// import {v4 as uuid} from "uuid";


// const storage = multer.diskStorage({
//     destination(req,file,cb){
//         cb(null,"uploads")
//     },
//     filename(req,file,cb){
//        const id = uuid();

//        const extName = file.originalName.split(".").pop();
    
//        const fileName = `${id}.${extName}`;

//        cb(null,fileName);
//     }
// });


// export const uploadFiles = multer({storage}).single("file");



import multer from "multer";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const uploadDir = "uploads";

        // Ensure the 'uploads' directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        cb(null, uploadDir);
    },
    filename(req, file, cb) {
        const id = uuid();

        // Use the correct property for the file's name and extract the extension safely
        const extName = path.extname(file.originalname);
    
        const fileName = `${id}${extName}`;

        cb(null, fileName);
    }
});

export const uploadFiles = multer({ storage }).single("file");

