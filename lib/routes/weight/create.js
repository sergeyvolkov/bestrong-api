'use strict';

const Joi = require('joi');

module.exports = {
  path: '/weight',
  method: 'POST',
  options: {
    description: 'Add weight record',
    tags: ['api', 'weight'],
    auth: 'jwt:access',
    validate: {
      payload: {
        type: Joi.any().valid('goal', 'record').required().description('Weight type - goal or record'),
        date: Joi.date().required().description('Date'),
        value: Joi.number().required().description('Value'),
      },
      headers: Joi.object({
        authorization: Joi.string().required(),
      }).options({ allowUnknown: true }),
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
      .created(`/weight/${weight.id}`);
  },
};
