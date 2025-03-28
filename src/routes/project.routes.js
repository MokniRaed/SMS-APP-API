import express from 'express';
import { upload } from '../config/multer.js';
import { createProduitCible, createProject, createProjectStatus, createTypeProject, deleteProduitCible, deleteProject, deleteProjectStatus, deleteTypeProject, exportProjects, getAllProduitsCible, getAllProjects, getAllProjectsStatus, getAllTypeProjects, getAllZones, getProduitCibleById, getProjectById, getProjectStatus, getTypeProjectById, updateProduitCible, updateProject, updateProjectStatus, updateTypeProject, uploadZones } from '../controllers/project.controller.js';

const router = express.Router();



router.get('/type', getAllTypeProjects);
router.get('/type/:id', getTypeProjectById);
router.post('/type', createTypeProject);
router.patch('/type/:id', updateTypeProject);
router.delete('/type/:id', deleteTypeProject);

router.get('/status', getAllProjectsStatus);
router.get('/status/:id', getProjectStatus);
router.post('/status', createProjectStatus);
router.patch('/status/:id', updateProjectStatus);
router.delete('/status/:id', deleteProjectStatus);


router.get('/produit-cible', getAllProduitsCible);
router.get('/produit-cible/:id', getProduitCibleById);
router.post('/productcible', createProduitCible);
router.patch('/productcible/:id', updateProduitCible);
router.delete('/productcible/:id', deleteProduitCible);


router.get('/zones', getAllZones);


router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', createProject);
router.patch('/:id', updateProject);
//check again for permessions

// router.delete('/:id', authorizeRole('admin'), deleteProject);
router.delete('/:id', deleteProject);
// Upload Excel file and save zones 
router.post('/upload-zones', upload.single('file'), uploadZones);
router.post('/export', exportProjects);

export default router;