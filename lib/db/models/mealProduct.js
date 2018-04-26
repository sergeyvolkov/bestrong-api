'use strict';

const Boom = require('boom');
const { Model } = require('schwifty');

module.exports = class MealProduct extends Model {
  static get tableName() {
    return 'meal_product';
  }

  static get relationMappings() {
    return {
      meal: {
        modelClass: require('./meal'),
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'meal_product.mealId',
          to: 'meal.id',
        },
      },
      product: {
        modelClass: require('./product'),
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'meal_product.productId',
          to: 'product.id',
        },
      },
    };
  }

  static createNotFoundError() {
    return Boom.notFound();
  }
};
