'use strict';

const Config = require('config');
const Boom = require('boom');
const Hapi = require('hapi');
const HapiAuth = require('hapi-auth-jwt2');
const Good = require('good');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');

const Password = require('./methods/password');
const Pkg = require('../package');

const DbPlugin = require('./db');
const JWTPlugin = require('./methods/jwt');

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
  server.register({
    plugin: JWTPlugin,
    options: {
      jwtSecretKey: Config.jwt.secretKey,
      jwtRefreshKey: Config.jwt.refreshKey,
      jwtPublicKey: Config.jwt.publicKey,
    },
  });
  server.auth.default('jwt:access');

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
  server.method('password.generateHash', Password.generateHash);
  server.method('password.generateSalt', Password.generateSalt);
  server.method('password.checkStrength', Password.checkStrength);

  // init models
  server.schwifty(require('./db/models/credentials'));
  server.schwifty(require('./db/models/defaultFoodComponent'));
  server.schwifty(require('./db/models/foodComponent'));
  server.schwifty(require('./db/models/product'));
  server.schwifty(require('./db/models/productComponent'));
  server.schwifty(require('./db/models/session'));
  server.schwifty(require('./db/models/token'));
  server.schwifty(require('./db/models/user'));
  server.schwifty(require('./db/models/weight'));

  // routes list
  // auth routes
  server.route(require('./routes/auth/sign-in'));
  server.route(require('./routes/auth/sign-out'));
  server.route(require('./routes/auth/sign-up'));
  server.route(require('./routes/auth/tokens/invalidate'));
  server.route(require('./routes/auth/tokens/refresh'));
  server.route(require('./routes/auth/tokens/verify'));

  // user routes
  server.route(require('./routes/user/change-password'));
  server.route(require('./routes/user/details'));
  server.route(require('./routes/user/update'));

  // weight routes
  server.route(require('./routes/weight/create'));
  server.route(require('./routes/weight/delete'));
  server.route(require('./routes/weight/details'));
  server.route(require('./routes/weight/listing'));
  server.route(require('./routes/weight/update'));

  // food-tracker routes
  server.route(require('./routes/food-tracker/food-components/create'));
  server.route(require('./routes/food-tracker/food-components/delete'));
  server.route(require('./routes/food-tracker/food-components/details'));
  server.route(require('./routes/food-tracker/food-components/listing'));
  server.route(require('./routes/food-tracker/food-components/update'));
  server.route(require('./routes/food-tracker/product/create'));
  server.route(require('./routes/food-tracker/product/delete'));
  server.route(require('./routes/food-tracker/product/details'));
  server.route(require('./routes/food-tracker/product/listing'));
  server.route(require('./routes/food-tracker/product/update'));
  server.route(require('./routes/food-tracker/product/component/create'));
  server.route(require('./routes/food-tracker/product/component/delete'));
  server.route(require('./routes/food-tracker/product/component/update'));

  return server;
}

compose()
  .then(async server => {
    await server.start();

    await server.knex().migrate.latest();

    if (Config.db.runSeeds) {
      await server.knex().seed.run();
    }
  }).catch(error => {
    /* eslint-disable-next-line */
    console.error(error);
    /* eslint-disable-next-line */
    process.exit(1);
  });
