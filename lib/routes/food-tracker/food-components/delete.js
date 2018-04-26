'use strict';

const Boom = require('boom');
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
    const {
      FoodComponent,
    } = request.models();

    const isFoodComponentUsed = await FoodComponent
      .query()
      .alias('fc')
      .innerJoinRelation('productComponents.mealProducts')
      .findOne({
        'fc.id': request.params.foodComponentId,
        'fc.userId': request.auth.credentials.id,
      });

    if (isFoodComponentUsed) {
      return Boom.conflict('Food component already used');
    }

    await FoodComponent
      .query()
      .delete()
      .findById(request.params.foodComponentId)
      .throwIfNotFound();

    return h.response();
  },
};
