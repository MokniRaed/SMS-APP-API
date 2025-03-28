import express from 'express';
import { upload } from '../config/multer.js';
import {
  addClientContact,
  createFonctionContact,
  createInformationLibre,
  createTypeInfoLibre,
  deleteContact,
  deleteFonctionContact,
  deleteInformationLibre,
  deleteTypeInfoLibre,
  exportContactClients,
  getAllFonctionContacts,
  getAllInformationLibres,
  getAllTypeInfoLibres,
  getClientContacts,
  getClientContactStats,
  getContactById,
  getFonctionContactById,
  getInformationLibreById,
  getTypeInfoLibreById,
  updateContact,
  updateFonctionContact,
  updateInformationLibre,
  updateTypeInfoLibre,
  uploadContacts
} from '../controllers/client.controller.js';

const router = express.Router();

// ================== ContactClient Routes ================== //

router.post('/contacts', addClientContact); // Create a contact for a client
router.get('/contacts', getClientContacts); // Get all contacts for a client
router.get('/contacts/:contactId', getContactById); // Get a specific contact by ID
router.patch('/contacts/:contactId', updateContact); // Update a contact by ID
router.delete('/contacts/:contactId', deleteContact); // Delete a contact by ID
// Upload Excel file and save client contacts
router.post('/upload-contacts', upload.single('file'), uploadContacts);
router.post('/export-contacts', exportContactClients);


// ================== FonctionContact Routes ================== //

router.post('/function', createFonctionContact); // Create a function contact
router.get('/fonction-contacts', getAllFonctionContacts); // Get all function contacts
router.get('/fonction-contacts/:id', getFonctionContactById); // Get a specific function contact by ID
router.patch('/function/:id', updateFonctionContact); // Update a function contact by ID
router.delete('/function/:id', deleteFonctionContact); // Delete a function contact by ID

// ================== TypeInfoLibre Routes ================== //

router.post('/type-info-libres', createTypeInfoLibre); // Create a type of free information
router.get('/type-info-libres', getAllTypeInfoLibres); // Get all types of free information
router.get('/type-info-libres/:id', getTypeInfoLibreById); // Get a specific type of free information by ID
router.patch('/type-info-libres/:id', updateTypeInfoLibre); // Update a type of free information by ID
router.delete('/type-info-libres/:id', deleteTypeInfoLibre); // Delete a type of free information by ID

// ================== InformationLibre Routes ================== //

router.post('/information-libres', createInformationLibre); // Create a free information
router.get('/information-libres', getAllInformationLibres); // Get all free information
router.get('/information-libres/:id', getInformationLibreById); // Get a specific free information by ID
router.patch('/information-libres/:id', updateInformationLibre); // Update a free information by ID
router.delete('/information-libres/:id', deleteInformationLibre); // Delete a free information by ID

router.get('/stats', getClientContactStats);
// router.get('/', getAllClients);
// router.get('/:id', getClientDetails);
// router.post('/', createClient);
// router.post('/:id/equipements', addClientEquipement);
// router.patch('/:id', updateClient);
// router.delete('/:id', deleteClient);




export default router;
