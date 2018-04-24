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
      session: {
        modelClass: require('./session'),
        relation: Model.HasManyRelation,
        join: {
          from: 'user.id',
          to: 'session.userId',
        },
      },
      weight: {
        modelClass: require('./weight'),
        relation: Model.HasManyRelation,
        join: {
          from: 'user.id',
          to: 'weight.userId',
        },
      },
    };
  }
};
