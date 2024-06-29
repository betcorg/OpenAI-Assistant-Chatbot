import path from 'path';
import multer from 'multer';
import express from 'express';
import { userAuth} from '../middleware/userAuth.js';
import { login, logout, signup } from '../controllers/v1/userAccess.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { pdfSummary } from '../controllers/v1/pdfSummary.js';
import { profile } from '../controllers/v1/appRoutes.js';
import { deleteUser, getUserById, getUsers, updateUser } from '../controllers/v1/users.js';
import { fileURLToPath } from 'url';
import { createNewAssistant, deleteAssistantById, getAssistantById, listAssistants, updateAssistantById, useAssistant } from '../controllers/v1/assistants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({ dest: path.join(__dirname, '../../pdfsummary') }); 

export const router = express.Router()

    .post('/signup', signup)
    .post('/login', userAuth, login)
    .post('/logout', logout)


    .get('/profile', verifyToken, profile)


    .get('/users', getUsers)
    .get('/users/:id', getUserById)
    .put('/users/:id', updateUser)
    .delete('/users/:id', deleteUser)


    .get('/assistants/list', listAssistants)
    .get('/assistants/retrieve', getAssistantById)
    .post('/assistants/create', createNewAssistant)
    .put('/assistants/update', updateAssistantById)
    .delete('/assistants/delete', deleteAssistantById)
    .post('/assistants/use', useAssistant)

    .post('/pdfsummary', upload.single('pdf'), pdfSummary);

