import express from 'express';
import {
    createTask,
    deleteTask,
    getAllTasks,
    getTaskById,
    updateTask
} from '../controllers/task.controller.js';
import { authorizeRole } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.patch('/:id', updateTask);
router.delete('/:id', authorizeRole('admin'), deleteTask);

export default router;