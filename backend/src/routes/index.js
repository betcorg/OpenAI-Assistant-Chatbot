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
    .get('/assistants/:user_id/', assistsController.listAssistants)
    .get('/assistants/:user_id/:assistant_id', assistsController.getAssistantById)
    .post('/assistants/:user_id', assistsController.createNewAssistant)
    .put('/assistants/:user_id/:assistant_id', assistsController.updateAssistantById)
    .delete('/assistants/:user_id/:assistant_id', assistsController.deleteAssistantById)

    .post('/assistants/use/:assistant_id', assistsController.useAssistant);



module.exports = { router };


