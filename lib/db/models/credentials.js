const { Model } = require('schwifty');

module.exports = class Credentials extends Model {
  static get tableName() {
    return 'credentials';
  }
};
