const AppError = require('../utils/AppError');

class UserController {

  async create(req, res) {
    const { name, email, password } = req.body;

    response.status(200).json({ name, email, password })
  }


}

module.exports = UserController;