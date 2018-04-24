'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  path: '/user/profile',
  method: 'PUT',
  options: {
    description: 'Update user profile',
    tags: ['api', 'user'],
    auth: 'jwt:access',
    validate: {
      payload: {
        username: Joi.string().description('Updated username'),
        email: Joi.string().email().description('Updated email'),
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
      username,
      email,
    } = request.payload;

    if (username) {
      const isUsernameNotUnique = await User
        .query()
        .where({ username })
        .first();

      if (isUsernameNotUnique) {
        return Boom.conflict('User with this username already exists');
      }
    }

    if (email) {
      const isEmailNotUnique = await User
        .query()
        .where({ email })
        .first();

      if (isEmailNotUnique) {
        return Boom.conflict('User with this email already exists');
      }
    }

    const user = await User
      .query()
      .findById(request.auth.credentials.id)
      .throwIfNotFound();

    await user
      .$query()
      .update({
        username,
        email,
      });

    return h.response();
  },
};
