'use strict';

const Boom = require('boom');
const { Model } = require('schwifty');

module.exports = class Meal extends Model {
  static get tableName() {
    return 'meal';
  }

  static get relationMappings() {
    return {
      user: {
        modelClass: require('./user'),
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'meal.userId',
          to: 'user.id',
        },
      },
      mealProducts: {
        modelClass: require('./mealProduct'),
        relation: Model.HasManyRelation,
        join: {
          from: 'meal.id',
          to: 'meal_product.mealId',
        },
      },
    };
  }

  static createNotFoundError() {
    return Boom.notFound();
  }
};
