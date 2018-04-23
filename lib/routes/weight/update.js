'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  path: '/weight/{weightId}',
  method: 'PUT',
  options: {
    description: 'Update a weight record',
    tags: ['api', 'weight'],
    auth: 'jwt',
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

    const weight = await Weight
      .query()
      .findById(request.params.weightId);

    if (!weight || weight.userId !== request.auth.credentials.id) {
      return Boom.notFound();
    }

    await weight
      .$query()
      .update(request.payload);

    return h.response();
  },
};
