import express from 'express';
import { upload } from '../config/multer.js';
import { createArticle, deleteArticle, getArticleById, getArticles, updateArticle, uploadArticles } from '../controllers/article.controller.js';

const router = express.Router();

// Define routes
router.get('/', getArticles);
router.get('/:id', getArticleById);
router.post('/', createArticle);
router.put('/:id', updateArticle);
router.delete('/:id', deleteArticle);
// Upload Route
router.post('/upload', upload.single('file'), uploadArticles);


export default router;
