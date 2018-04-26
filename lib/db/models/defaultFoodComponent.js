'use strict';

const Boom = require('boom');
const { Model } = require('schwifty');

module.exports = class DefaultFoodComponent extends Model {
  static get tableName() {
    return 'default_food_component';
  }

  static createNotFoundError() {
    return Boom.notFound();
  }
};
