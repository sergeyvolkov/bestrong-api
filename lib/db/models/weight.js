'use strict';

const { Model } = require('schwifty');

module.exports = class Weight extends Model {
  static get tableName() {
    return 'weight';
  }
};
