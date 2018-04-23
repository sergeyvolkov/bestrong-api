'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  path: '/user/profile',
  method: 'GET',
  options: {
    description: 'User description',
    tags: ['api', 'user'],
    auth: 'jwt',
    validate: {
      headers: Joi.object({
        authorization: Joi.string(),
      }).options({ allowUnknown: true }),
    },
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
