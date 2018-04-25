'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  path: '/auth/token/verify',
  method: 'POST',
  options: {
    description: 'Verify access or refresh token',
    tags: ['api', 'auth'],
    auth: 'jwt:any',
    validate: {
      headers: Joi.object({
        authorization: Joi.string().required(),
      }).options({ allowUnknown: true }),
    },
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
