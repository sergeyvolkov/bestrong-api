'use strict';

const Joi = require('joi');

module.exports = {
  path: '/auth/sign-out',
  method: 'POST',
  options: {
    description: 'Sign out from all active sessions and revokes all tokens',
    tags: ['api', 'auth'],
    auth: 'jwt:access',
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
    const {
      Session,
      Token,
    } = request.models();

    // @todo do it through update with innerJoin (doesn't work now)
    const affectedSessions = await Session
      .query()
      .select('id')
      .where({
        status: 'active',
        userId: request.auth.credentials.id,
      });
    const affectedSessionsIds = affectedSessions.map(({ id }) => id);

    await Session
      .query()
      .update({ status: 'inactive' })
      .where({ status: 'active' })
      .whereIn('id', affectedSessionsIds);

    await Token
      .query()
      .update({ expiredAt: new Date() })
      .whereNull('expiredAt')
      .whereIn('sessionId', affectedSessionsIds);

    return h.response();
  },
};
