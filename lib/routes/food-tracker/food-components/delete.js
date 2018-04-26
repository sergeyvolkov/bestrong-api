'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/food-components/{foodComponentId}',
  method: 'DELETE',
  options: {
    description: 'Delete a food component',
    tags: ['api', 'food-component'],
    auth: 'jwt:access',
    validate: {
      params: {
        foodComponentId: Joi.number(),
      },
    },
    response: {
      emptyStatusCode: 204,
      schema: false,
    },
  },
  handler: async function (request, h) {
    const { FoodComponent } = request.models();

    const foodComponent = await FoodComponent
      .query()
      .findOne({
        id: request.params.foodComponentId,
        userId: request.auth.credentials.id,
      })
      .throwIfNotFound();

    // @todo check is food component already used
    await foodComponent
      .$query()
      .delete();

    return h.response();
  },
};
