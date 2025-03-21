import express from 'express';
import {
    createFromClient,
    createRole,
    createUser,
    deleteRole,
    deleteUser,
    getAllRoles,
    getAllUsers,
    getAllUsersByrole,
    getRoleById,
    getUserById,
    getUserProfile,
    updatePassword,
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

// ================== User Profile Routes ================== //

router.get('/profile/:id', getUserProfile); // Get a specific role by ID
router.post('/profile/password/:id', updatePassword); // Get a specific role by ID



// ================== User Routes ================== //

router.post('/', createUser); // Create a user
router.get('/', getAllUsers); // Get all users
router.get('/role/:role', getAllUsersByrole); // Get all users
router.get('/:id', getUserById); // Get a specific user by ID
router.patch('/:id', updateUser); // Update a user by ID
router.delete('/:id', deleteUser); // Delete a user by ID


router.post('/createFromClient/:clientId', createFromClient);

export default router;
