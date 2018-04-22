'use strict';

const Hapi = require('hapi');

const DbPlugin = require('./db');

async function compose() {
  const server = Hapi.server({
    port: process.env.PORT || 80,
    routes: {

    },
  });

  server.register(DbPlugin);

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
