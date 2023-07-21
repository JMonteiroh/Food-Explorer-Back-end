const knex = require('../database/knex');

class PlatesController {
  async create( req, res ){
    const { name, category, description, price, ingredients } = req.body;

    const user_id = req.user.id;

    const [ plate_id ] = await knex('plates').insert({
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

    return res.json();

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
    const { name, ingredients } = req.query;

    const user_id = req.user.id;

    let plates;

    if(ingredients){
      const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());
      
      plates = await knex('ingredients')
        .select([
          "plates.id",
          "plates.name",
          "plates.user_id",
        ])
        .where('plates.user_id', user_id)
        .whereLike('plates.name', `%${name}%`)
        .whereIn('ingredients.name', filterIngredients)
        .innerJoin('plates', "plates.id", 'ingredients.plate_id')
        .orderBy('plates.name')

    }else {
      plates = await knex('plates')
        .where({ user_id })
        .whereLike('name',`%${name}%`)
        .orderBy('name');
    }

    const userIngredients = await knex('ingredients').where({ user_id });
    const platesWithIngredients = plates.map( plate => {
      const platesIngredients = userIngredients.filter( ingredient => ingredient.plate_id === plate.id);

      return {
        ...plate,
        ingredients: platesIngredients
      }
    })

    return res.json(platesWithIngredients)
  }
}

module.exports = PlatesController;