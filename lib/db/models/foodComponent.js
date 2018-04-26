'use strict';

const Boom = require('boom');
const { Model } = require('schwifty');

module.exports = class FoodComponent extends Model {
  static get tableName() {
    return 'food_component';
  }

  static get relationMappings() {
    return {
      products: {
        modelClass: require('./product'),
        relation: Model.ManyToManyRelation,
        join: {
          from: 'food_component.id',
          through: {
            modelClass: require('./productComponent'),
            from: 'product_component.componentId',
            to: 'product_component.productId',
          },
          to: 'product.id',
        },
      },
      productComponents: {
        modelClass: require('./productComponent'),
        relation: Model.HasManyRelation,
        join: {
          from: 'food_component.id',
          to: 'product_component.componentId',
        },
      },
    };
  }

  static createNotFoundError() {
    return Boom.notFound();
  }
};
