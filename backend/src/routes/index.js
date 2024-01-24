const express = require('express');
const router = express.Router();

const authController = require('../controllers/v1/userAccess');
const { userAuth } = require('../middleware/userAuth');
router
    .post('/signup', authController.signup)
    .post('/login', userAuth, authController.login)
    .post('/logout', authController.logout);


const routesController = require('../controllers/v1/appRoutes');
const { verifyToken } = require('../middleware/verifyToken');
router
    .get('/profile', verifyToken, routesController.profile);


const usersController = require('../controllers/v1/users');
router
    .get('/users', usersController.getUsers)
    .get('/users/:id', usersController.getUserById)
    .put('/users/:id', usersController.updateUser)
    .delete('/users/:id', usersController.deleteUser);


const assistsController = require('../controllers/v1/assistants');
router
    .get('/assistants/list', assistsController.listAssistants)
    .get('/assistants/retrieve', assistsController.getAssistantById)
    .post('/assistants/create', assistsController.createNewAssistant)
    .put('/assistants/update', assistsController.updateAssistantById)
    .delete('/assistants/delete', assistsController.deleteAssistantById)

    .post('/assistants/use', assistsController.useAssistant);



const path = require('path');
const multer = require('multer');
const upload = multer({ dest: path.join(__dirname, '../../pdfsummary') });
const { pdfSummary } = require('../controllers/v1/pdfSummary');

router.post('/pdfsummary', upload.single('pdf'), pdfSummary);



module.exports = { router };


