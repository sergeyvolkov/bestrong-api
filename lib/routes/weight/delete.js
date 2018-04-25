'use strict';

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
      .findOne({
        id: request.params.weightId,
        userId: request.auth.credentials.id,
      })
      .throwIfNotFound();

    await weight
      .$query()
      .delete();

    return h.response();
  },
};
