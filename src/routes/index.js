const { Router } = require('express');

const usersRoutes = require('./users.routes');
const platesRoutes = require('./plates.routes');

const routes = Router()

routes.use('/users', usersRoutes)
routes.use('/plates', platesRoutes)

module.exports = routes;