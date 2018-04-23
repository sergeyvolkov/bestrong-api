'use strict';

const Joi = require('joi');

module.exports = {
  path: '/weight',
  method: 'POST',
  options: {
    description: 'Create a user\'s weight record',
    tags: ['api', 'weight'],
    auth: 'jwt',
    validate: {
      payload: {
        type: Joi.any().valid('goal', 'record').required(),
        date: Joi.date().required(),
        value: Joi.number().required(),
      },
      headers: Joi.object({
        authorization: Joi.string(),
      }).options({allowUnknown: true}),
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
