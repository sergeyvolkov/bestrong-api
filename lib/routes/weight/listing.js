'use strict';

const Joi = require('joi');

module.exports = {
  path: '/weight',
  method: 'GET',
  options: {
    description: 'Get user\'s weight records',
    tags: ['api', 'weight'],
    auth: 'jwt',
    validate: {
      query: {
        type: Joi.any().valid('goal', 'record'),
        dateFrom: Joi.date(),
        dateTo: Joi.date(),
      },
      headers: Joi.object({
        authorization: Joi.string().required(),
      }).options({allowUnknown: true}),
    },
    response: {
      modify: true,
      options: {
        stripUnknown: true,
      },
      schema: {
        items: Joi.array().items({
          id: Joi.number(),
          type: Joi.string(),
          date: Joi.date(),
          value: Joi.number(),
        }),
      },
    },
  },
  handler: async function (request) {
    const { User } = request.models();

    const {
      type,
      dateFrom,
      dateTo,
    } = request.query;

    const user = await User
      .query()
      .findById(request.auth.credentials.id)
      .throwIfNotFound();

    const query = user
      .$relatedQuery('weight');

    if (type) {
      query.where({type});
    }

    if (dateFrom) {
      query.where('date', '>=', dateFrom);
    }

    if (dateTo) {
      query.where('date', '<=', dateTo);
    }

    return {
      items: await query,
    };
  },
};
