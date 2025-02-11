import express from 'express';
import { upload } from '../config/multer.js';
import { createProject, deleteProject, getAllProjects, updateProject, uploadZones } from '../controllers/project.controller.js';
import { authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllProjects);
router.post('/', createProject);
router.patch('/:id', updateProject);
router.delete('/:id', authorizeRole('admin'), deleteProject);
// Upload Excel file and save client contacts
router.post('/upload-zones', upload.single('file'), uploadZones);

export default router;