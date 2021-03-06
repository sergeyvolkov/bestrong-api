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
        .findOne({ username });

      if (isUsernameNotUnique) {
        return Boom.conflict('User with this username already exists');
      }
    }

    if (email) {
      const isEmailNotUnique = await User
        .query()
        .findOne({ email });

      if (isEmailNotUnique) {
        return Boom.conflict('User with this email already exists');
      }
    }

    await User
      .query()
      .update(request.payload)
      .findById(request.auth.credentials.id)
      .throwIfNotFound();

    return h.response();
  },
};
