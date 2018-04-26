'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  path: '/auth/tokens/verify',
  method: 'POST',
  options: {
    description: 'Verify access/refresh token',
    tags: ['api', 'auth-token'],
    auth: 'jwt:any',
    response: {
      modify: true,
      options: {
        stripUnknown: true,
      },
      schema: {
        type: Joi.any().valid('access', 'refresh'),
        expiresIn: Joi.number(),
      },
    },
  },
  handler: async function (request) {
    const rid = this.jwt.getRidFromToken(request.auth.token);

    if (!rid) {
      return Boom.unauthorized('Incorrect token');
    }

    const { Token } = request.models();

    const token = await Token
      .query()
      .findOne({ rid });

    return token.toJSON();
  },
};
