'use strict';

const Joi = require('joi');

module.exports = {
  path: '/weights/{weightId}',
  method: 'GET',
  options: {
    description: 'Get weight record details',
    tags: ['api', 'weight'],
    auth: 'jwt:access',
    validate: {
      params: {
        weightId: Joi.number().description('Weight ID'),
      },
    },
    response: {
      modify: true,
      options: {
        stripUnknown: true,
      },
      schema: {
        id: Joi.number(),
        type: Joi.string(),
        date: Joi.date(),
        value: Joi.number(),
      },
    },
  },
  handler: async function (request) {
    const { Weight } = request.models();

    return await Weight
      .query()
      .findOne({
        id: request.params.weightId,
        userId: request.auth.credentials.id,
      })
      .throwIfNotFound();
  },
};
