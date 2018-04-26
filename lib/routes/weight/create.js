'use strict';

const Joi = require('joi');

module.exports = {
  path: '/weights',
  method: 'POST',
  options: {
    description: 'Create a weight record',
    tags: ['api', 'weight'],
    auth: 'jwt:access',
    validate: {
      payload: {
        type: Joi.any().valid('goal', 'record').required().description('Weight type - goal or record'),
        date: Joi.date().required().description('Date'),
        value: Joi.number().required().description('Value'),
      },
    },
    response: {
      modify: true,
      options: {
        stripUnknown: true,
      },
      schema: {
        id: Joi.number(),
      },
    },
  },
  handler: async function (request, h) {
    const { Weight } = request.models();

    const weight = await Weight
      .query()
      .insertAndFetch({
        ...request.payload,
        userId: request.auth.credentials.id,
      });

    return h
      .response(weight)
      .created(`/weights/${weight.id}`);
  },
};
