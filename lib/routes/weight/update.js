'use strict';

const Joi = require('joi');

module.exports = {
  path: '/weights/{weightId}',
  method: 'PUT',
  options: {
    description: 'Update a weight record',
    tags: ['api', 'weight'],
    auth: 'jwt:access',
    validate: {
      params: {
        weightId: Joi.number(),
      },
      payload: {
        type: Joi.any().valid('goal', 'record').description('Weight type'),
        date: Joi.date().description('Weight date'),
        value: Joi.number().description('Value'),
      },
      headers: Joi.object({
        authorization: Joi.string(),
      }).options({ allowUnknown: true }),
    },
    response: {
      emptyStatusCode: 204,
      schema: false,
    },
  },
  handler: async function (request, h) {
    const { Weight } = request.models();

    await Weight
      .query()
      .update(request.payload)
      .findOne({
        id: request.params.weightId,
        userId: request.auth.credentials.id,
      })
      .throwIfNotFound();

    return h.response();
  },
};
