'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/product/${productId}',
  method: 'PUT',
  options: {
    description: 'Update a product',
    tags: ['api', 'food-tracker'],
    auth: 'jwt:access',
    validate: {
      params: {
        productId: Joi.number(),
      },
      payload: {
        title: Joi.string(),
        portionCount: Joi.number(),
        portionUnit: Joi.any().valid('g', 'piece', 'glass'),
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

    await Product
      .query()
      .update(request.payload)
      .findOne({
        userId: request.auth.credentials.id,
        id: request.params.productId,
      })
      .throwIfNotFound();

    return h.response();
  },
};
