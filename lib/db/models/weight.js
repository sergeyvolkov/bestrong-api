'use strict';

const Boom = require('boom');
const { Model } = require('schwifty');

module.exports = class Weight extends Model {
  static get tableName() {
    return 'weight';
  }

  static createNotFoundError() {
    return Boom.notFound();
  }
};
