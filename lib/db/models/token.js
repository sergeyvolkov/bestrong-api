'use strict';

const { Model } = require('schwifty');

module.exports = class Token extends Model {
  static get tableName() {
    return 'token';
  }
};
