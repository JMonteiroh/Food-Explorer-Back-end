const knex = require('../database/knex');

class PlatesController {
  async create( req, res ){
    const { name, category, description, price, ingredients } = req.body;

    const { user_id } = req.params;

    const [plate_id] = await knex('plates').insert({
      name,
      category,
      description,
      price,
      user_id

    })

    const ingredientsInsert = ingredients.map(name => {
      return {
        name,
        plate_id,
        user_id
      }

    });

    await knex('ingredients').insert(ingredientsInsert);

    res.json();

  }

  async show( req, res ){ 
    const { id } = req.params;

    const plate = await knex('plates').where({ id }).first();
    const ingredients = await knex('ingredients').where({ plate_id: id }).orderBy('name');

    return res.json({
      ...plate,
      ingredients
    })
  }

  async delete( req, res ){
    const { id } = req.params;

    await knex('plates').where({ id }).delete()

    return res.json();
  }

  async index( req, res ){
    const { name, ingredients, user_id } = req.query;

    let plates;

    if(ingredients){
      const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());
      
      plates = await knex('ingredients')
        .whereIn('name', filterIngredients)

    }else {
      plates = await knex('plates')
        .where({ user_id })
        .whereLike('name',`%${name}%`)
        .orderBy('name');
    }

      return res.json(plates)
  }
}

module.exports = PlatesController;