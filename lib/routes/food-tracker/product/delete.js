'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  path: '/food-tracker/products/{productId}',
  method: 'DELETE',
  options: {
    description: 'Delete a product',
    tags: ['api', 'product'],
    auth: 'jwt:access',
    validate: {
      params: {
        productId: Joi.number(),
      },
    },
    response: {
      emptyStatusCode: 204,
      schema: false,
    },
  },
  handler: async function (request, h) {
    const {
      Product,
      MealProduct,
    } = request.models();

    const isProductUsed = await MealProduct
      .query()
      .findOne({
        productId: request.params.productId,
      });

    if (isProductUsed) {
      return Boom.conflict('Food component already used');
    }

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
