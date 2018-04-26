'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/food-components',
  method: 'GET',
  options: {
    description: 'Get food component listing',
    tags: ['api', 'food-component'],
    auth: 'jwt:access',
    response: {
      modify: true,
      options: {
        stripUnknown: true,
      },
      schema: {
        items: Joi.array().items({
          id: Joi.number(),
          title: Joi.string(),
        }),
      },
    },
  },
  handler: async function (request) {
    const { FoodComponent } = request.models();

    const foodComponents = await FoodComponent
      .query()
      .where({
        userId: request.auth.credentials.id,
      });

    return {
      items: foodComponents,
    };
  },
};
