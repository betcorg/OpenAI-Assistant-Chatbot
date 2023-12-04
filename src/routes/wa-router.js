const express = require('express');
const whatsappController = require('../controller/wa-api-controller');


const waRouter = express.Router();

waRouter.get('/', whatsappController.verification)
      .post('/', whatsappController.receiveMessage);

module.exports = waRouter;