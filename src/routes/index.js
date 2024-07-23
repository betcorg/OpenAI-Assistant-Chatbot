import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './usersRoutes.js';
import assistantRoutes from './assistantRoutes.js';
import pdfRoutes from './pdf.js';
import chatwootRoutes from './chatwootRoutes.js';
import documentsRoutes from './documents.js';

const router = express.Router();
const chatwootRouter = express.Router();

router
    .use('/auth', authRoutes)
    .use('/users', userRoutes)
    .use('/assistants', assistantRoutes)
    .use('/pdf', pdfRoutes)
    .use('/documents', documentsRoutes);

chatwootRouter
    .use('/', chatwootRoutes);

export { router, chatwootRouter };