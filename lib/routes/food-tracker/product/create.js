'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/products',
  method: 'POST',
  options: {
    description: 'Create a new product',
    tags: ['api', 'product'],
    auth: 'jwt:access',
    validate: {
      payload: {
        title: Joi.string().required(),
        portionCount: Joi.number().required(),
        portionUnit: Joi.any().valid('g', 'piece', 'glass').required(),
        foodComponents: Joi.array().items({
          id: Joi.number().required(),
          value: Joi.number().required(),
        }).required(),
      },
    },
    response: {
      modify: true,
      options: {
        stripUnknown: true,
      },
      schema: {
        id: Joi.number(),
      },
    },
  },
  handler: async function (request, h) {
    const { Product } = request.models();

    const productComponents = request.payload.foodComponents.map(foodComponent => ({
      componentId: foodComponent.id,
      componentValue: foodComponent.value,
    }));

    const product = await Product
      .query()
      .insertGraphAndFetch({
        userId: request.auth.credentials.id,
        title: request.payload.title,
        portion_count: request.payload.portionCount,
        portion_unit: request.payload.portionUnit,
        productComponents,
      });

    return h
      .response(product)
      .created(`/food-tracker/products/${product.id}`);
  },
};
