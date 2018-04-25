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
    };
  }

  static createNotFoundError() {
    return Boom.notFound();
  }
};
