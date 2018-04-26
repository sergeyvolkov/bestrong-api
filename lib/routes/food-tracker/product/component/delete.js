'use strict';

const Boom = require('boom');
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
    const {
      ProductComponent,
      MealProduct,
    } = request.models();

    const isProductComponentUsed = await MealProduct
      .query()
      .findOne({
        productId: request.params.productId,
      });

    if (isProductComponentUsed) {
      return Boom.conflict('Food component already used');
    }

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
