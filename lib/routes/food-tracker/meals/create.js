'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/meals',
  method: 'POST',
  options: {
    description: 'Create a new meal',
    tags: ['api', 'meal'],
    auth: 'jwt:access',
    validate: {
      payload: {
        date: Joi.date().iso().required(),
        title: Joi.string().required(),
        mealProducts: Joi.array().items({
          productId: Joi.number().required(),
          portionWeight: Joi.number().required(),
        }).required(),
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
      },
    },
  },
  handler: async function (request, h) {
    const { Meal } = request.models();

    const meal = await Meal
      .query()
      .insertGraphAndFetch({
        ...request.payload,
        userId: request.auth.credentials.id,
      });

    return h
      .response(meal)
      .created(`/food-tracker/meals/${meal.id}`);
  },
};
