import express from 'express';
import { addCommandLine, createCommand, createStatutArtCmd, createStatutCmd, deleteStatutArtCmd, deleteStatutCmd, getAllCommands, getAllStatutArtCmds, getAllStatutCmds, getCommandById, getLineCommandsbyOrder, getStatutArtCmdById, getStatutCmdById, updateStatutArtCmd, updateStatutCmd } from '../controllers/command.controller.js';

const router = express.Router();

// Order routes
router.get('/', getAllCommands);
router.post('/', createCommand);

// ** StatutCmd Routes ** 
router.get('/statutcmds', getAllStatutCmds);
router.post('/statutcmds', createStatutCmd);
router.get('/statutcmds/:id', getStatutCmdById);
router.put('/statutcmds/:id', updateStatutCmd);
router.delete('/statutcmds/:id', deleteStatutCmd);

// ** StatutArtCmd Routes ** 
router.get('/statutartcmds', getAllStatutArtCmds);
router.post('/statutartcmds', createStatutArtCmd);
router.get('/statutartcmds/:id', getStatutArtCmdById);
router.put('/statutartcmds/:id', updateStatutArtCmd);
router.delete('/statutartcmds/:id', deleteStatutArtCmd);

// ** CommandLines Routes ** 

router.get('/cmd/:id', getLineCommandsbyOrder);

// Order routes
router.get('/:id', getCommandById);
router.post('/:id/lines', addCommandLine);

export default router;