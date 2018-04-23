'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  path: '/weight/{weightId}',
  method: 'GET',
  options: {
    description: 'Get user\'s weight record',
    tags: ['api', 'weight'],
    auth: 'jwt',
    validate: {
      params: {
        weightId: Joi.number().required(),
      },
      headers: Joi.object({
        authorization: Joi.string().required(),
      }).options({allowUnknown: true}),
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

    // @todo investigate, why chain `.throwIfNotFound` does not work correctly
    const weight = await Weight
      .query()
      .findById(request.params.weightId);

    if (!weight) {
      return Boom.notFound();
    }

    if (weight.userId !== request.auth.credentials.id) {
      return Boom.notFound();
    }

    return weight;
  },
};
