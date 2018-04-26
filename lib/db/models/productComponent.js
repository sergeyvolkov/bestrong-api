'use strict';

const Boom = require('boom');
const { Model } = require('schwifty');

module.exports = class ProductComponent extends Model {
  static get tableName() {
    return 'product_component';
  }

  static get relationMappings() {
    return {
      foodComponent: {
        modelClass: require('./foodComponent'),
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'product_component.componentId',
          to: 'food_component.id',
        },
      },
      product: {
        modelClass: require('./product'),
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'product_component.productId',
          to: 'product.id',
        },
      },
      mealProducts: {
        modelClass: require('./mealProduct'),
        relation: Model.HasManyRelation,
        join: {
          from: 'product_component.productId',
          to: 'meal_product.productId',
        },
      },
    };
  }

  static createNotFoundError() {
    return Boom.notFound();
  }
};
