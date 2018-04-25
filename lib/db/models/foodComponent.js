'use strict';

const Boom = require('boom');
const { Model } = require('schwifty');

module.exports = class FoodComponent extends Model {
  static get tableName() {
    return 'food_component';
  }

  static createNotFoundError() {
    return Boom.notFound();
  }
};
