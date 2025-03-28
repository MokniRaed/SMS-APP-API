import express from 'express';
import { addCommandLine, createCommand, createStatutArtCmd, createStatutCmd, deleteCommand, deleteStatutArtCmd, deleteStatutCmd, exportCommands, getAllCommands, getAllStatutArtCmds, getAllStatutCmds, getCommandById, getLineCommandsbyOrder, getOrderStats, getStatutArtCmdById, getStatutCmdById, updateStatutArtCmd, updateStatutCmd, validateOrder } from '../controllers/command.controller.js';

const router = express.Router();



// ** StatutCmd Routes ** 
router.get('/statutcmds', getAllStatutCmds);
router.post('/statutcmds', createStatutCmd);
router.get('/statutcmds/:id', getStatutCmdById);
router.put('/statutcmds/:id', updateStatutCmd);
router.delete('/statutcmds/:id', deleteStatutCmd);

// ** StatutArtCmd Routes ** 
router.get('/statutartcmds', getAllStatutArtCmds);
// router.post('/statutartcmds', createStatutArtCmd);
router.get('/statutartcmds/:id', getStatutArtCmdById);
router.patch('/statutartcmds/:id', updateStatutArtCmd);
// router.delete('/statutartcmds/:id', deleteStatutArtCmd);

// ** CommandLines Routes ** 

router.get('/cmd/:id', getLineCommandsbyOrder);

// Order routes
router.get('/', getAllCommands);
router.post('/', createCommand);
router.get('/:id', getCommandById);
router.delete('/:id', deleteCommand);

router.post('/:id/lines', addCommandLine);
router.patch('/validate/:id', validateOrder);
router.post('/export', exportCommands);

router.get('/stats', getOrderStats);

export default router;
