import express from 'express';
import { upload } from '../config/multer.js';
import { createCategory, deleteCategory, exportCategories, getCategories, getCategoriesByType, getCategoryById, updateCategory, uploadCategories } from '../controllers/category.controller.js';

const router = express.Router();
// router.get('/zones', getAllZones);
router.get("/type/:type", getCategoriesByType);


router.post("/", createCategory); // Create a category
router.get("/", getCategories); // Get all categories
router.get("/:id", getCategoryById); // Get category by ID
router.put("/:id", updateCategory); // Update category
router.delete("/:id", deleteCategory); // Delete category
// Upload Excel file and save categories 
router.post('/upload', upload.single('file'), uploadCategories);
router.post('/export', exportCategories);

export default router;