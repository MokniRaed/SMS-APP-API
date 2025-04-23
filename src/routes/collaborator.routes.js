import express from 'express';
import { upload } from '../config/multer.js';
import {
  getClientContactStats
} from '../controllers/client.controller.js';
import { addCollaborator, deleteCollaborator, exportCollaborators, getCollaboratorById, getCollaborators, updateCollaborator, uploadCollaborators } from '../controllers/collaborator.controller.js';

const router = express.Router();

// ================== ContactClient Routes ================== //

router.post('/', addCollaborator); // Create a contact for a client
router.get('/', getCollaborators); // Get all contacts for a client
router.get('/:collabId', getCollaboratorById); // Get a specific contact by ID
router.patch('/:collabId', updateCollaborator); // Update a contact by ID
router.delete('/:collabId', deleteCollaborator); // Delete a contact by ID
// Upload Excel file and save client contacts
router.post('/upload', upload.single('file'), uploadCollaborators);
router.post('/export', exportCollaborators);


// ================== FonctionRoutes ================== //

// router.post('/function', createFonctionContact); // Create a function contact
// router.get('/fonction', getAllFonctionContacts); // Get all function contacts
// router.get('/fonction/:id', getFonctionContactById); // Get a specific function contact by ID
// router.patch('/function/:id', updateFonctionContact); // Update a function contact by ID
// router.delete('/function/:id', deleteFonctionContact); // Delete a function contact by ID


router.get('/stats', getClientContactStats);




export default router;
