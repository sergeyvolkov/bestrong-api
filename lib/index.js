'use strict';

const Config = require('config');
const Boom = require('boom');
const Hapi = require('hapi');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');

const Password = require('./password');
const Pkg = require('../package');

const DbPlugin = require('./db');

async function compose() {
  const server = Hapi.server({
    port: process.env.PORT || 80,
    routes: {
      cors: {
        headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
      },
      validate: {
        failAction: async (request, h, err) => {
          // eslint-disable-next-line no-console
          console.log(err);
          if (process.env.NODE_ENV === 'production') {
            throw Boom.badRequest('Invalid request payload input');
          } else {
            // eslint-disable-next-line no-console
            console.error(err);
            throw err;
          }
        },
      },
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

  // init methods
  server.bind(server.methods);
  server.method('password.generateHash', Password.generateHash);
  server.method('password.generateSalt', Password.generateSalt);

  // init models
  server.schwifty(require('./db/models/credentials'));
  server.schwifty(require('./db/models/user'));

  // routes list
  server.route(require('./routes/auth/sign-in'));
  server.route(require('./routes/auth/sign-up'));

  return server;
}

compose()
  .then(async (server) => {
    await server.start();

    await server.knex().migrate.latest();
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
