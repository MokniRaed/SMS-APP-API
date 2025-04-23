import express from 'express';
import { archiveRequest, createRequest, deleteRequest, getAllRequests, getRequestById, getRequestByRequestId, updateRequest } from '../controllers/request.controller.js';

const router = express.Router();

router.get('/', getAllRequests);
router.post('/', createRequest);
router.get('/:id', getRequestById);
router.get('/request/:requestId', getRequestByRequestId);
router.put('/:id', updateRequest);
router.delete('/:id', deleteRequest);
router.patch('/:id/archive', archiveRequest);

export default router;
