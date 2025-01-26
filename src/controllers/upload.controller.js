import multer from 'multer';
import path from 'path';
import Upload from '../models/upload.model.js';

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF and PDF are allowed.'), false);
    }
};

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: fileFilter
});

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const { entityType, entityId } = req.body;

        const fileUpload = new Upload({
            filename: req.file.filename,
            path: req.file.path,
            mimetype: req.file.mimetype,
            size: req.file.size,
            entityType,
            entityId,
            uploadedBy: req.user.userId
        });

        await fileUpload.save();
        res.status(201).json(fileUpload);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getFilesByEntity = async (req, res) => {
    try {
        const { entityType, entityId } = req.params;
        const files = await Upload.find({ entityType, entityId })
            .populate('uploadedBy', 'username');
        res.json(files);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteFile = async (req, res) => {
    try {
        const file = await Upload.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Only allow admins or the user who uploaded the file to delete it
        if (req.user.role !== 'admin' && file.uploadedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this file' });
        }

        await file.remove();
        res.json({ message: 'File deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};