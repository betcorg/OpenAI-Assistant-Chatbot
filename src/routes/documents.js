import express from 'express';
import { addDocument } from '../controllers/v1/addDocument.js';

const router = express.Router();

router.post('/add-document', addDocument);

export default router;
