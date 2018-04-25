'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/food-components/{foodComponentId}',
  method: 'DELETE',
  options: {
    description: 'Delete a food component',
    tags: ['api', 'food-tracker'],
    auth: 'jwt:access',
    validate: {
      params: {
        foodComponentId: Joi.number(),
      },
      headers: Joi.object({
        authorization: Joi.string().required(),
      }).options({ allowUnknown: true }),
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
