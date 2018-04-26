'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/meals/{mealId}/products/{mealProductId}',
  method: 'DELETE',
  options: {
    description: 'Delete a product from meal',
    tags: ['api', 'meal'],
    auth: 'jwt:access',
    validate: {
      params: {
        mealId: Joi.number(),
        mealProductId: Joi.number(),
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
      .delete()
      .findOne({
        id: request.params.mealProductId,
        mealId: request.params.mealId,
      })
      .throwIfNotFound();

    return h.response();
  },
};
