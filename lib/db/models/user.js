const { Model } = require('schwifty');

module.exports = class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get relationMappings() {
    return {
      credentials: {
        modelClass: require('./credentials'),
        relation: Model.HasOneRelation,
        join: {
          from: 'users.id',
          to: 'credentials.userId',
        },
      },
    };
  }
};
