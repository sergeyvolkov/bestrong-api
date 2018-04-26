'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/food-components/{foodComponentId}',
  method: 'GET',
  options: {
    description: 'Get food component details',
    tags: ['api', 'food-component'],
    auth: 'jwt:access',
    validate: {
      params: {
        foodComponentId: Joi.number(),
      },
    },
    response: {
      modify: true,
      options: {
        stripUnknown: true,
      },
      schema: {
        id: Joi.number(),
        title: Joi.string(),
      },
    },
  },
  handler: async function (request) {
    const { FoodComponent } = request.models();

    return await FoodComponent
      .query()
      .findOne({
        id: request.params.foodComponentId,
        userId: request.auth.credentials.id,
      })
      .throwIfNotFound();
  },
};
