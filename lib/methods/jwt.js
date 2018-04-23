'use strict';

const Config = require('config');
const JWT = require('jsonwebtoken');
const UUID62 = require('uuid62');

module.exports = {
  generateToken: async (payload, options = {}) => {
    const expiresIn = options.expiresIn || 24 * 60 * 60; // 1 day
    const expiresAt = new Date((Math.floor(Date.now() / 1000) + expiresIn) * 1000);

    const rid = UUID62.v4();

    const token = JWT.sign({
      data: payload,
      rid,
    }, Config.jwt.secretKey, {
      expiresIn,
      algorithm: 'RS256',
    });

    return {
      token,
      rid,
      expiresIn,
      expiresAt,
    };
  },
};
