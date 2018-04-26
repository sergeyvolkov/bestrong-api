'use strict';

const Joi = require('joi');

module.exports = {
  path: '/weights/{weightId}',
  method: 'DELETE',
  options: {
    description: 'Delete a weight record',
    tags: ['api', 'weight'],
    auth: 'jwt:access',
    validate: {
      params: {
        weightId: Joi.number().description('Weight ID'),
      },
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
      .delete()
      .findOne({
        id: request.params.weightId,
        userId: request.auth.credentials.id,
      })
      .throwIfNotFound();

    return h.response();
  },
};
