'use strict';

const Hapi = require('hapi');

async function compose() {
  const server = Hapi.server({
    port: process.env.PORT || 80,
    routes: {

    },
  });

  return server;
}

compose()
  .then(async (server) => {
    await server.start();
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
