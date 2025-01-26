import express from 'express';
import { getAllRequests, createRequest, updateRequest } from '../controllers/request.controller.js';

const router = express.Router();

router.get('/', getAllRequests);
router.post('/', createRequest);
router.put('/:id', updateRequest);

export default router;