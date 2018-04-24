'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  path: '/user/change-password',
  method: 'PUT',
  options: {
    description: 'Change user password',
    tags: ['api', 'user'],
    auth: 'jwt:access',
    validate: {
      payload: {
        oldPassword: Joi.string().required().description('Old password'),
        newPassword: Joi.string().disallow(Joi.ref('oldPassword')).required().description('New password'),
      },
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
    const { User } = request.models();

    const {
      oldPassword,
      newPassword,
    } = request.payload;

    const user = await User
      .query()
      .findById(request.auth.credentials.id)
      .throwIfNotFound();

    const passwordStrength = this.password.checkStrength(newPassword);
    if (passwordStrength.score < 2) {
      return Boom.badData('New password is too weak');
    }

    const hashedOldPassword = this.password.generateHash(oldPassword, user.salt);

    const isOldPasswordValid = await user
      .$relatedQuery('credentials')
      .where({ password: hashedOldPassword })
      .first();

    if (!isOldPasswordValid) {
      return Boom.badData('Old password is incorrect');
    }

    const hashedNewPassword = this.password.generateHash(newPassword, user.salt);
    await user
      .$relatedQuery('credentials')
      .update({ password: hashedNewPassword });

    return h.response();
  },
};
