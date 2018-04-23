'use strict';

const Config = require('config');
const Boom = require('boom');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-jwt2');
const Good = require('good');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');

const JWT = require('./jwt');
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

  server.register(HapiAuth);
  server.auth.strategy('jwt', 'jwt', {
    key: Config.jwt.publicKey,
    validate: async decoded => {
      return {
        isValid: true,
        credentials: decoded.data,
      };
    },
    verifyOptions: {
      algorithms: [ 'RS256' ],
    },
  });
  server.auth.default('jwt');

  server.register({
    plugin: Good,
    options: {
      ops: {
        interval: 60000, // 1 minute
      },
      reporters: {
        consoleReporter: [
          {
            module: 'good-console',
          },
          'stdout',
        ],
      },
    },
  });

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
  server.method('jwt.generateToken', JWT.generateToken);
  server.method('password.generateHash', Password.generateHash);
  server.method('password.generateSalt', Password.generateSalt);

  // init models
  server.schwifty(require('./db/models/credentials'));
  server.schwifty(require('./db/models/token'));
  server.schwifty(require('./db/models/user'));

  // routes list
  // auth routes
  server.route(require('./routes/auth/sign-in'));
  server.route(require('./routes/auth/sign-up'));

  // user routes
  server.route(require('./routes/user/details'));
  server.route(require('./routes/user/update'));

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
