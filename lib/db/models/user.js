'use strict';

const Boom = require('boom');
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
      sessions: {
        modelClass: require('./session'),
        relation: Model.HasManyRelation,
        join: {
          from: 'user.id',
          to: 'session.userId',
        },
      },
      weights: {
        modelClass: require('./weight'),
        relation: Model.HasManyRelation,
        join: {
          from: 'user.id',
          to: 'weight.userId',
        },
      },
      foodComponents: {
        modelClass: require('./foodComponent'),
        relation: Model.HasManyRelation,
        join: {
          from: 'user.id',
          to: 'food_component.userId',
        },
      },
      meals: {
        modelClass: require('./meal'),
        relation: Model.HasManyRelation,
        join: {
          from: 'user.id',
          to: 'meal.userId',
        },
      },
    };
  }

  static createNotFoundError() {
    return Boom.notFound();
  }
};
