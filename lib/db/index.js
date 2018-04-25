'use strict';

const Config = require('config');
const { knexSnakeCaseMappers } = require('objection');
const Schwifty = require('schwifty');

module.exports = {
  plugin: Schwifty,
  options: {
    knex: {
      client: 'pg',
      connection: Config.db.postgres,
      migrations: {
        directory: './lib/db/migrations',
      },
      seeds: {
        directory: './lib/db/seeds',
      },
      ...knexSnakeCaseMappers(),
    },
  },
};
