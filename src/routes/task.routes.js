import express from 'express';
import {
    createTask,
    deleteTask,
    getAllTasks,
    getTaskById,
    updateTask
} from '../controllers/task.controller.js';

const router = express.Router();

router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.patch('/:id', updateTask);
//check again for permessions
// router.delete('/:id', authorizeRole('admin'), deleteTask);
router.delete('/:id', deleteTask);

export default router;