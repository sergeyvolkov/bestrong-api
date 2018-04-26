'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/food-components',
  method: 'POST',
  options: {
    description: 'Create a new food component',
    tags: ['api', 'food-component'],
    auth: 'jwt:access',
    validate: {
      payload: {
        title: Joi.string().required(),
      },
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
    const { FoodComponent } = request.models();

    const foodComponent = await FoodComponent
      .query()
      .insert({
        ...request.payload,
        userId: request.auth.credentials.id,
      });

    return h
      .response(foodComponent)
      .created(`/food-tracker/food-components/${foodComponent.id}`);
  },
};
