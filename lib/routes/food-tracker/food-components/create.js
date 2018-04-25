'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/food-components',
  method: 'POST',
  options: {
    description: 'Create a new food component',
    tags: ['api', 'food-tracker'],
    auth: 'jwt:access',
    validate: {
      payload: {
        title: Joi.string().required(),
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
