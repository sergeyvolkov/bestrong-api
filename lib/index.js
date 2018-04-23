'use strict';

const Config = require('config');
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
          console.log(err);
          if (process.env.NODE_ENV === 'production') {
            throw Boom.badRequest(`Invalid request payload input`);
          } else {
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
  server.route(require('./routes/auth/sign-up'));

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
