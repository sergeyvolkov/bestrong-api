'use strict';

const { Model } = require('schwifty');

module.exports = class Token extends Model {
  static get tableName() {
    return 'token';
  }

  static get relationMappings() {
    return {
      session: {
        modelClass: require('./session'),
        relation: Model.BelongsToOneRelation,
        join: {
          from: 'token.sessionId',
          to: 'session.id',
        },
      },
    };
  }

  static get virtualAttributes() {
    return ['isExpired'];
  }

  get isExpired() {
    return !!this.expiredAt;
  }
};
