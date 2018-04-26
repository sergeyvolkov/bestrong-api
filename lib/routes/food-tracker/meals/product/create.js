'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/meals/{mealId}/products',
  method: 'POST',
  options: {
    description: 'Add a new product to meal',
    tags: ['api', 'meal'],
    auth: 'jwt:access',
    validate: {
      params: {
        mealId: Joi.number(),
      },
      payload: {
        productId: Joi.number().required(),
        portionWeight: Joi.number().required(),
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
    const { MealProduct } = request.models();

    const productComponent = await MealProduct
      .query()
      .insertAndFetch({
        ...request.payload,
        mealId: request.params.mealId,
      });

    return h
      .response(productComponent)
      .created(`/food-tracker/meals/${request.params.mealId}`);
  },
};
