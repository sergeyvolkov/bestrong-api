'use strict';

const Joi = require('joi');

module.exports = {
  path: '/user/profile',
  method: 'GET',
  options: {
    description: 'Get user profile',
    tags: ['api', 'user'],
    auth: 'jwt:access',
    response: {
      modify: true,
      options: {
        stripUnknown: true,
      },
      schema: {
        id: Joi.number(),
        username: Joi.string(),
        email: Joi.string().email(),
      },
    },
  },
  handler: async function (request) {
    const { User } = request.models();

    return await User
      .query()
      .findById(request.auth.credentials.id)
      .throwIfNotFound();
  },
};
