import express from 'express';
import { webhookController } from '../controllers/chatwoot/cwWebhookController.js';
import { whatsappLoginController } from '../controllers/chatwoot/waLoginContoller.js';

const chatwootRoutes = express.Router();

chatwootRoutes
    .post('/webhook', webhookController)

    .get('/wa-login', whatsappLoginController);

export default chatwootRoutes;