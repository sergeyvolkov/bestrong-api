'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/products/{productId}/components/{productComponentId}',
  method: 'DELETE',
  options: {
    description: 'Delete a food component from product',
    tags: ['api', 'product'],
    auth: 'jwt:access',
    validate: {
      params: {
        productId: Joi.number(),
        productComponentId: Joi.number(),
      },
    },
    response: {
      emptyStatusCode: 204,
      schema: false,
    },
  },
  handler: async function (request, h) {
    const { ProductComponent } = request.models();

    // @todo check is product already used
    await ProductComponent
      .query()
      .delete()
      .findOne({
        id: request.params.productComponentId,
        productId: request.params.productId,
      })
      .throwIfNotFound();

    return h.response();
  },
};
