'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/meals/{mealId}',
  method: 'GET',
  options: {
    description: 'Get meal details',
    tags: ['api', 'meal'],
    auth: 'jwt:access',
    validate: {
      params: {
        mealId: Joi.number(),
      },
      query: {
        withProducts: Joi.boolean().default(false),
        withComponents: Joi.boolean().default(false),
      },
    },
    response: {
      modify: true,
      options: {
        stripUnknown: true,
      },
      schema: {
        id: Joi.number(),
        date: Joi.date().iso(),
        title: Joi.string(),
        products: Joi.array().items({
          id: Joi.number(),
          productId: Joi.number(),
          product: Joi.string(),
          portionWeight: Joi.number(),
          components: Joi.array().items({
            id: Joi.number(),
            title: Joi.string(),
            total: Joi.number(),
          }),
        }),
        components: Joi.array().items({
          id: Joi.number(),
          title: Joi.string(),
          total: Joi.number(),
        }),
      },
    },
  },
  handler: async function (request) {
    const { Meal } = request.models();

    const mealQuery = Meal
      .query()
      .findOne({
        id: request.params.mealId,
        userId: request.auth.credentials.id,
      })
      .throwIfNotFound();

    let eager = '';

    if (request.query.withComponents) {
      eager = 'mealProducts.product.productComponents.foodComponent';
    } else if (request.query.withProducts) {
      eager = 'mealProducts.product';
    }

    if (eager) {
      mealQuery
        .eager(eager);
    }

    const meal = await mealQuery;

    return this.meal.transformForResponse(meal, request.query);
  },
};
