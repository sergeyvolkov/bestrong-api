'use strict';

const Config = require('config');
const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');

const Pkg = require('../package');

const DbPlugin = require('./db');

async function compose() {
  const server = Hapi.server({
    port: process.env.PORT || 80,
    routes: {

    },
  });

  server.register(DbPlugin);

  if (Config.swagger.enabled) {
    await server.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: {
          info: {
            title: `${Pkg.name} API Documentation`,
            version: Pkg.version,
          },
        },
      },
    ]);
  }

  // init models
  server.schwifty(require('./db/models/credentials'));
  server.schwifty(require('./db/models/user'));

  return server;
}

compose()
  .then(async (server) => {
    await server.start();

    await server.knex().migrate.latest();
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
