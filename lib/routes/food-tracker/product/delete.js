'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/products/${productId}',
  method: 'DELETE',
  options: {
    description: 'Delete a product',
    tags: ['api', 'food-tracker'],
    auth: 'jwt:access',
    validate: {
      params: {
        productId: Joi.number(),
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
    const { Product } = request.models();

    // @todo check is product already used
    await Product
      .query()
      .delete()
      .findOne({
        userId: request.auth.credentials.id,
        id: request.params.productId,
      })
      .throwIfNotFound();

    return h.response();
  },
};
