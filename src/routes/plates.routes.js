const { Router } = require('express');

const PlatesController = require('../controllers/PlatesController')
const platesRoutes = Router();

const platesController = new PlatesController();

platesRoutes.post('/:user_id', platesController.create);
platesRoutes.get('/:id', platesController.show);

module.exports = platesRoutes;
