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
