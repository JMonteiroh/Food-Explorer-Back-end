const { Router } = require('express');

const UserController = require('../controllers/UsersController')
const userRoutes = Router();




const userController = new UserController();
userRoutes.get('/', myMiddleware, userController.create);

module.exports = userRoutes;
