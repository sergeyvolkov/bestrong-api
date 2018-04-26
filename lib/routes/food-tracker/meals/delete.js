'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/meals/{mealId}',
  method: 'DELETE',
  options: {
    description: 'Delete a meal',
    tags: ['api', 'meal'],
    auth: 'jwt:access',
    validate: {
      params: {
        mealId: Joi.number(),
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
    const { Meal } = request.models();

    await Meal
      .query()
      .delete()
      .findOne({
        id: request.params.mealId,
        userId: request.auth.credentials.id,
      })
      .throwIfNotFound();

    return h.response();
  },
};
