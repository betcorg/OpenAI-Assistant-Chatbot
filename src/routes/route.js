const express = require('express');
const router = express.Router();
const apiController = require('../controller/api-controller');


router
.get('/', apiController.verificar)
.post('/', apiController.recibir);

module.exports = router;