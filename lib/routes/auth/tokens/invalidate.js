'use strict';

const Joi = require('joi');

module.exports = {
  path: '/auth/tokens/invalidate',
  method: 'POST',
  options: {
    description: 'Invalidate current token',
    tags: ['api', 'auth'],
    auth: 'jwt:any',
    validate: {
      headers: Joi.object({
        authorization: Joi.string().required(),
      }).options({ allowUnknown: true }),
    },
    response: {
      emptyStatusCode: 204,
      schema: false,
    },
  },
  handler: async function (request, h) {
    const rid = this.jwt.getRidFromToken(request.auth.token);

    const { Token } = request.models();

    await Token
      .query()
      .whereNull('expiredAt')
      .where({ rid })
      .update({
        expiredAt: new Date(),
      });

    return h.response();
  },
};
