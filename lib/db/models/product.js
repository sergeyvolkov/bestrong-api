'use strict';

const Boom = require('boom');
const { Model } = require('schwifty');

module.exports = class Product extends Model {
  static get tableName() {
    return 'product';
  }

  static get relationMappings() {
    return {
      foodComponents: {
        modelClass: require('./foodComponent'),
        relation: Model.ManyToManyRelation,
        join: {
          from: 'product.id',
          through: {
            modelClass: require('./productComponent'),
            from: 'product_component.productId',
            to: 'product_component.componentId',
          },
          to: 'food_component.id',
        },
      },
      productComponents: {
        modelClass: require('./productComponent'),
        relation: Model.HasManyRelation,
        join: {
          from: 'product.id',
          to: 'product_component.productId',
        },
      },
      mealProducts: {
        modelClass: require('./mealProduct'),
        relation: Model.HasManyRelation,
        join: {
          from: 'product.id',
          to: 'meal_product.id',
        },
      },
    };
  }

  static createNotFoundError() {
    return Boom.notFound();
  }
};
