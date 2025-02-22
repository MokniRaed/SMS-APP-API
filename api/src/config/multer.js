import multer from 'multer';

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save uploaded files to the 'uploads' folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Rename the file to avoid conflicts
    }
});

const upload = multer({ storage });

export { upload };
