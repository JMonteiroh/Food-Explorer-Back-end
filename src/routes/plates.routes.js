const { Router } = require('express');

const PlatesController = require('../controllers/PlatesController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const platesRoutes = Router();

const platesController = new PlatesController();

platesRoutes.use(ensureAuthenticated)

platesRoutes.get('/', platesController.index);
platesRoutes.post('/:user_id', platesController.create);
platesRoutes.get('/:id', platesController.show);
platesRoutes.delete('/:id', platesController.delete);

module.exports = platesRoutes;
