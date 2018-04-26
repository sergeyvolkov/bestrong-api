'use strict';

module.exports = {
  path: '/auth/tokens/invalidate',
  method: 'POST',
  options: {
    description: 'Invalidate current token',
    tags: ['api', 'auth-token'],
    auth: 'jwt:any',
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
