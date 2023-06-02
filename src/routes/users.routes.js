const { Router } = require('express');

const UserController = require('../controllers/UsersController')
const userRoutes = Router();


function myMiddleware(req, res, next) {

}


const userController = new UserController();
userRoutes.get('/', myMiddleware, userController.create);

module.exports = userRoutes;
