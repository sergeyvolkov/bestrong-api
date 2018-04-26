'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/meals',
  method: 'GET',
  options: {
    description: 'Get meals listing',
    tags: ['api', 'meal'],
    auth: 'jwt:access',
    validate: {
      query: {
        date: Joi.date().iso(),
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
        items: Joi.array().items({
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
        }),
      },
    },
  },
  handler: async function (request) {
    const { Meal } = request.models();

    const mealsQuery = Meal
      .query()
      .where({
        userId: request.auth.credentials.id,
      });

    let eager = '';

    if (request.query.withComponents) {
      eager = 'mealProducts.product.productComponents.foodComponent';
    } else if (request.query.withProducts) {
      eager = 'mealProducts.product';
    }

    if (request.query.date) {
      mealsQuery
        .andWhere({
          date: request.query.date,
        });
    }

    if (eager) {
      mealsQuery
        .eager(eager);
    }

    const meals = await mealsQuery;

    return {
      items: meals.map(meal => this.meal.transformForResponse(meal, request.query)),
    };
  },
};
