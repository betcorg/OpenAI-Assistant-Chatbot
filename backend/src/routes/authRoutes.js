import express from 'express';
import { userAuth } from '../middleware/userAuth.js';
import { login, logout, signup } from '../controllers/v1/userAccess.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', userAuth, login);
router.post('/logout', logout);

export default router;
