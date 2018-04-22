const Config = require('config');
const Schwifty = require('schwifty');

module.exports = {
  plugin: Schwifty,
  options: {
    knex: {
      client: 'pg',
      connection: Config.db.postgres,
      migrations: {
        directory: './lib/db/migrations',
      }
    },
  },
};
