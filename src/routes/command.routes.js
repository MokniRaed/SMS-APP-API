import express from 'express';
import { getAllCommands, createCommand, addCommandLine } from '../controllers/command.controller.js';

const router = express.Router();

router.get('/', getAllCommands);
router.post('/', createCommand);
router.post('/:id/lines', addCommandLine);

export default router;