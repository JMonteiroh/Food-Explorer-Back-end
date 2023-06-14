const knex = require('../database/knex');

class IngredientsController {
  async index( req, res ) {
    const { user_id } = req.params;
    
    const ingredients = await knex('ingredients')
      .where({ user_id });

      return res.json(ingredients)

  }

}

module.exports = IngredientsController;