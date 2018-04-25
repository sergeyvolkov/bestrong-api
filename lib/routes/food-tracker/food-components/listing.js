'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/food-component',
  method: 'GET',
  options: {
    description: 'Get food component listing',
    tags: ['api', 'food-tracker'],
    auth: 'jwt:access',
    validate: {
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
