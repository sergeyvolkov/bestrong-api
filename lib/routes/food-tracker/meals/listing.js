'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/meals',
  method: 'GET',
  options: {
    description: 'Get products listing',
    tags: ['api', 'meal'],
    auth: 'jwt:access',
    validate: {
      query: {
        date: Joi.date().iso(),
        withProducts: Joi.boolean().default(false),
      },
      headers: Joi.object({
        authorization: Joi.string().required(),
      }).options({ allowUnknown: true }),
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
          mealProducts: Joi.array().items({
            id: Joi.number(),
            productId: Joi.number(),
            product: Joi.string(),
            portionWeight: Joi.number(),
          }).default([]),
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

    if (request.query.withProducts) {
      mealsQuery
        .eager('mealProducts.product');
    }

    if (request.query.date) {
      mealsQuery
        .andWhere({
          date: request.query.date,
        });
    }

    const meals = await mealsQuery;

    return {
      items: meals.map(meal => ({
        ...meal,
        mealProducts: (meal.mealProducts || []).map(mealProduct => ({
          id: mealProduct.id,
          productId: mealProduct.productId,
          product: mealProduct.product.title,
          portionWeight: mealProduct.portionWeight,
        })),
      })),
    };
  },
};
