'use strict';

const { Model } = require('schwifty');

module.exports = class Session extends Model {
  static get tableName() {
    return 'session';
  }

  static get relationMappings() {
    return {
      token: {
        modelClass: require('./token'),
        relation: Model.HasManyRelation,
        join: {
          from: 'token.sessionId',
          to: 'session.id',
        },
      },
    };
  }

  static get virtualAttributes() {
    return ['isInactive'];
  }

  get isInactive() {
    return this.status !== 'active';
  }
};
