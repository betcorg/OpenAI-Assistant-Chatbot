import path from 'path';
import multer from 'multer';
import express from 'express';
import { pdfSummary } from '../controllers/v1/pdfSummary.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = multer({ dest: path.join(__dirname, '../../pdfsummary') }); 

const router = express.Router();

router.post('/', upload.single('pdf'), pdfSummary);

export default router;
