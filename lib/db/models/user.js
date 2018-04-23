'use strict';

const { Model } = require('schwifty');

module.exports = class User extends Model {
  static get tableName() {
    return 'user';
  }

  static get relationMappings() {
    return {
      credentials: {
        modelClass: require('./credentials'),
        relation: Model.HasOneRelation,
        join: {
          from: 'user.id',
          to: 'credentials.userId',
        },
      },
    };
  }
};
