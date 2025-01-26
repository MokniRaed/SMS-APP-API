import express from 'express';
import {
    createRole,
    createUser,
    deleteRole,
    deleteUser,
    getAllRoles,
    getAllUsers,
    getRoleById,
    getUserById,
    updateRole,
    updateUser
} from '../controllers/user.controller.js';

const router = express.Router();

// ================== Role Routes ================== //

router.post('/roles', createRole); // Create a role
router.get('/roles', getAllRoles); // Get ausersll roles
router.get('/roles/:id', getRoleById); // Get a specific role by ID
router.patch('/roles/:id', updateRole); // Update a role by ID
router.delete('/roles/:id', deleteRole); // Delete a role by ID

// ================== User Routes ================== //

router.post('/', createUser); // Create a user
router.get('/', getAllUsers); // Get all users
router.get('/:id', getUserById); // Get a specific user by ID
router.patch('/:id', updateUser); // Update a user by ID
router.delete('/:id', deleteUser); // Delete a user by ID

export default router;