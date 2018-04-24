'use strict';

const Boom = require('boom');
const Hoek = require('hoek');
const JWT = require('jsonwebtoken');
const UUID62 = require('uuid62');

const internals = {};

internals.validateAccessToken = async function ({ credentials, token, tokenType }) {
  const { rid } = credentials;
  const savedToken = await this.db.query('token').findByAccessRid(rid);

  if (!savedToken) {
    throw Boom.unauthorized('Invalid token', tokenType, { credentials: token });
  }
  if (savedToken.isExpired) {
    throw Boom.unauthorized('Expired token', tokenType, { credentials: token });
  }

  await savedToken.$loadRelated('session');

  if (!savedToken.session.isActive) {
    throw Boom.unauthorized('Expired token', tokenType, { credentials: token });
  }
  return {
    isValid: Number(savedToken.session.identity) === Number(credentials.data.id),
    credentials: credentials.data,
  };
};

internals.validateRefreshToken = async function ({ credentials, token, tokenType }) {
  const { rid } = credentials;
  const savedToken = await this.db.query('token').findByRefreshRid(rid);

  if (!savedToken) {
    throw Boom.unauthorized('Invalid token', tokenType, { credentials: token });
  }
  if (savedToken.isExpired) {
    throw Boom.unauthorized('Expired token', tokenType, { credentials: token });
  }

  await savedToken.$loadRelated('session');

  if (!savedToken.session.isActive) {
    throw Boom.unauthorized('Expired token', tokenType, { credentials: token });
  }
  return {
    isValid: Number(savedToken.session.identity) === Number(credentials.data.id),
    credentials: credentials.data,
  };
};

internals.generateToken = async function (payload, options = {}) {
  const expiresIn = options.expiresIn || this.expiresIn;
  const expiresAt = new Date((Math.floor(Date.now() / 1000) + expiresIn) * 1000);

  return new Promise((resolve, reject) => {
    const rid = UUID62.v4();

    JWT.sign({
      data: payload,
      rid,
      refresh: this.refresh,
    }, this.secretKey, { expiresIn, algorithm: this.algorithm, issuer: 'bestrong-api' }, (err, token) => {
      if (err) {
        return reject(err);
      }
      resolve({
        token,
        rid,
        expiresIn,
        expiresAt,
      });
    });
  });
};

internals.getRidFromToken = (token) => {
  const decoded = JWT.decode(token);

  if (!decoded) {
    throw Boom.unauthorized('Invalid token', { credentials: token });
  }

  return decoded.rid;
};

module.exports.plugin = {
  name: 'bestrong-jwt',
  register: async (server, options) => {
    Hoek.assert(options.jwtRefreshKey, 'Option "jwtRefreshKey" is required');
    Hoek.assert(options.jwtPublicKey, 'Option "jwtPublicKey" is required');
    Hoek.assert(options.jwtSecretKey, 'Option "jwtSecretKey" is required');

    server.auth.strategy('jwt:access', 'jwt', {
      secretKey: options.jwtPublicKey,
      validateFunc: internals.validateAccessToken,
      verify: { algorithms: ['RS256'] },
      bind: server,
    });

    server.auth.strategy('jwt:refresh', 'jwt', {
      secretKey: options.jwtRefreshKey,
      validateFunc: internals.validateRefreshToken,
      verify: { algorithms: ['HS256'] },
      bind: server,
    });

    server.auth.strategy('jwt:any', 'jwt', {
      secretKey: (decoded) => ({ secretKey: decoded.refresh ? options.jwtRefreshKey : options.jwtPublicKey }),
      validateFunc: async function (data, request, h) {
        const validateFunc = data.credentials.refresh ? internals.validateRefreshToken : internals.validateAccessToken;
        return validateFunc.call(this, data, request, h);
      },
      verify: { algorithms: ['HS256', 'RS256'] },
      bind: server,
    });

    server.method('jwt.generateAccessToken', internals.generateToken, {
      bind: {
        expiresIn: 30 * 60, // 30 minute
        secretKey: options.jwtSecretKey,
        algorithm: 'RS256',
      },
    });
    server.method('jwt.generateRefreshToken', internals.generateToken, {
      bind: {
        expiresIn: 30 * 24 * 60 * 60, // 30d
        secretKey: options.jwtRefreshKey,
        refresh: true,
        algorithm: 'HS256',
      },
    });
    server.method('jwt.getRidFromToken', internals.getRidFromToken);
  },
};
