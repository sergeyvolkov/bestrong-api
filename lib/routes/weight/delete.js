'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  path: '/weight/{weightId}',
  method: 'DELETE',
  options: {
    description: 'Delete a weight record',
    tags: ['api', 'weight'],
    auth: 'jwt:access',
    validate: {
      params: {
        weightId: Joi.number().description('Weight ID'),
      },
      headers: Joi.object({
        authorization: Joi.string().required(),
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
      .delete();

    return h.response();
  },
};
