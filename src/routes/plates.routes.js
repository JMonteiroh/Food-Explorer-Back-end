const { Router } = require('express');
const multer = require('multer');
const uploadConfig = require('../configs/upload')

const PlatesController = require('../controllers/PlatesController');
const ensureAuthenticated = require('../middlewares/ensureAuthenticated');
const platesRoutes = Router();

const platesController = new PlatesController();

const upload = multer(uploadConfig.MULTER);

platesRoutes.use(ensureAuthenticated)

platesRoutes.get('/', platesController.index);
platesRoutes.post('/:user_id', platesController.create);
platesRoutes.get('/:id', platesController.show);
platesRoutes.delete('/:id', platesController.delete);
platesRoutes.patch('/:id', upload.single("plateimage"), platesController.update);

module.exports = platesRoutes;
