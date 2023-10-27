const knex = require('../database/knex');
const AppError = require('../utils/AppError');
const DiskStorage = require("../providers/DiskStorage")

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
    const { name, ingredients, category } = req.query;

    let plates;

    if(ingredients){
      const filterIngredients = ingredients.split(',').map(ingredient => ingredient.trim());
      
      plates = await knex('ingredients')
        .select([
          "plates.id",
          "plates.name",
        ])
        .whereLike('plates.name', `%${name}%`)
        .whereIn('ingredients.name', filterIngredients)
        .innerJoin('plates', "plates.id", 'ingredients.plate_id')
        .orderBy('plates.name')

    }else {
      plates = await knex('plates')
        .whereLike('name',`%${name}%`)
        .orderBy('name');
    }

    if (category) {
      plates = plates.filter(plate => plate.category === category);
    }

    const userIngredients = await knex('ingredients');
    const platesWithIngredients = plates.map( plate => {
      const platesIngredients = userIngredients.filter( ingredient => ingredient.plate_id === plate.id);

      return {
        ...plate,
        ingredients: platesIngredients
      }
    })
    return res.json(platesWithIngredients)
  }

  async update( req, res ){
    const plate_id = req.params.id;
    const plateFilename = req.file.filename;

    const diskStorage = new DiskStorage();

    const plate = await knex("plates")
    .where({ id: plate_id }).first();

    if(!plate){
      throw new AppError("Prato não encontrado", 401);
    }

    if(plate.image){
      await diskStorage.deleteFile(plate.image);
    }

    const filename = await diskStorage.saveFile(plateFilename);
    plate.image = filename;

    await knex("plates").update(plate).where({ id: plate_id});
    
    return res.json(plate)

  }
}

module.exports = PlatesController;