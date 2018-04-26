'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/meals/${mealId}',
  method: 'GET',
  options: {
    description: 'Get food component details',
    tags: ['api', 'meal'],
    auth: 'jwt:access',
    validate: {
      params: {
        mealId: Joi.number(),
      },
      query: {
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
        id: Joi.number(),
        date: Joi.date().iso(),
        title: Joi.string(),
        mealProducts: Joi.array().items({
          id: Joi.number(),
          productId: Joi.number(),
          product: Joi.string(),
          portionWeight: Joi.number(),
        }).default([]),
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

    if (request.query.withProducts) {
      mealQuery
        .eager('mealProducts.product');
    }

    const meal = await mealQuery;

    return {
      ...meal,
      mealProducts: (meal.mealProducts || []).map(mealProduct => ({
        id: mealProduct.id,
        productId: mealProduct.productId,
        product: mealProduct.product.title,
        portionWeight: mealProduct.portionWeight,
      })),
    };
  },
};
