import express from 'express';
import {
    createTask, createTaskStatus, createTypeTask,
    deleteTask, deleteTaskStatus, deleteTypeTask,
    getAllTasks, getAllTaskStatus, getAllTypeTasks,
    getTaskById, getTaskStatus, getTypeTask,
    updateTask, updateTaskStatus, updateTypeTask
} from '../controllers/task.controller.js';
import {
    createProjectStatus,
    createTypeProject, deleteProjectStatus, deleteTypeProject, getAllProjectsStatus,
    getAllTypeProjects, getProjectStatus,
    getTypeProjectById, updateProjectStatus,
    updateTypeProject
} from "../controllers/project.controller.js";

const router = express.Router();



router.get('/taskType', getAllTypeTasks);
router.get('/taskType/:id', getTypeTask);
router.post('/taskType', createTypeTask);
router.patch('/taskType/:id', updateTypeTask);
router.delete('/taskType/:id', deleteTypeTask);

router.get('/taskStatus', getAllTaskStatus);
router.get('/taskStatus/:id', getTaskStatus);
router.post('/taskStatus', createTaskStatus);
router.patch('/taskStatus/:id', updateTaskStatus);
router.delete('/taskStatus/:id', deleteTaskStatus);



router.get('/', getAllTasks);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.patch('/:id', updateTask);
//check again for permessions
// router.delete('/:id', authorizeRole('admin'), deleteTask);
router.delete('/:id', deleteTask);

export default router;