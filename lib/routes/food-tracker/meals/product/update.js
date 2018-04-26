'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/meals/{mealId}/products/{mealProductId}',
  method: 'PUT',
  options: {
    description: 'Update a product in meal',
    tags: ['api', 'meal'],
    auth: 'jwt:access',
    validate: {
      params: {
        mealId: Joi.number(),
        mealProductId: Joi.number(),
      },
      payload: {
        portionWeight: Joi.number(),
      },
    },
    response: {
      emptyStatusCode: 204,
      schema: false,
    },
  },
  handler: async function (request, h) {
    const { MealProduct } = request.models();

    await MealProduct
      .query()
      .update(request.payload)
      .findOne({
        id: request.params.mealProductId,
        mealId: request.params.mealId,
      })
      .throwIfNotFound();

    return h.response();
  },
};
