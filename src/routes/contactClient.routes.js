import express from 'express';
import {
  addClientContact,
  deleteContact,
  getClientContacts,
  getContactById,
  updateContact
} from '../controllers/client.controller.js';

const router = express.Router();

// ContactClient CRUD routes
router.post('/:id/contacts', addClientContact); // Create a contact for a client
router.get('/:id/contacts', getClientContacts); // Get all contacts for a client
router.get('/:id/contacts/:contactId', getContactById); // Get a specific contact by ID
router.patch('/:id/contacts/:contactId', updateContact); // Update a contact by ID
router.delete('/:id/contacts/:contactId', deleteContact); // Delete a contact by ID

export default router;