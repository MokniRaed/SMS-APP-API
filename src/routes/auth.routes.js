import express from 'express';
import { body } from 'express-validator';
import { signup, login } from '../controllers/auth.controller.js';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

router.post('/signup',
  [
    body('username').trim().isLength({ min: 3 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('role').isIn(['admin', 'collaborator', 'client'])
  ],
  validateRequest,
  signup
);

router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').exists()
  ],
  validateRequest,
  login
);

export default router;