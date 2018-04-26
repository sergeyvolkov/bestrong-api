'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/products/{productId}/components/{productComponentId}',
  method: 'PUT',
  options: {
    description: 'Update a food component in product',
    tags: ['api', 'product'],
    auth: 'jwt:access',
    validate: {
      params: {
        productId: Joi.number(),
        productComponentId: Joi.number(),
      },
      payload: {
        componentValue: Joi.number(),
      },
    },
    response: {
      emptyStatusCode: 204,
      schema: false,
    },
  },
  handler: async function (request, h) {
    const { ProductComponent } = request.models();

    await ProductComponent
      .query()
      .update(request.payload)
      .findOne({
        id: request.params.productComponentId,
        productId: request.params.productId,
      })
      .throwIfNotFound();

    return h.response();
  },
};
