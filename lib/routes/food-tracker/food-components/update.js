'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/food-component/{foodComponentId}',
  method: 'PUT',
  options: {
    description: 'Update a food component',
    tags: ['api', 'food-tracker'],
    auth: 'jwt:access',
    validate: {
      params: {
        foodComponentId: Joi.number(),
      },
      payload: {
        title: Joi.string().required(),
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

    await FoodComponent
      .query()
      .update(request.payload)
      .findOne({
        id: request.params.foodComponentId,
        userId: request.auth.credentials.id,
      })
      .throwIfNotFound();

    return h.response();
  },
};
