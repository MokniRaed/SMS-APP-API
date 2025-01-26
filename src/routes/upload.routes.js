import express from 'express';
import { deleteFile, getFilesByEntity, upload, uploadFile } from '../controllers/upload.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, upload.single('file'), uploadFile);
router.get('/:entityType/:entityId', authenticateToken, getFilesByEntity);
router.delete('/:id', authenticateToken, deleteFile);

export default router;