import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { profile } from '../controllers/v1/appRoutes.js';
import { deleteUser, getUserById, getUsers, updateUser } from '../controllers/v1/users.js';

const router = express.Router();

router.get('/profile', verifyToken, profile);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
