'use strict';

const Joi = require('joi');

module.exports = {
  path: '/weights',
  method: 'GET',
  options: {
    description: 'Get all weight records',
    tags: ['api', 'weight'],
    auth: 'jwt:access',
    validate: {
      query: {
        type: Joi.any().valid('goal', 'record').description('Weight type'),
        dateFrom: Joi.date().description('Weight date'),
        dateTo: Joi.date().description('Value'),
      },
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
    const { Weight } = request.models();

    const {
      type,
      dateFrom,
      dateTo,
    } = request.query;

    const query = Weight
      .query()
      .where({
        userId: request.auth.credentials.id,
      });

    if (type) {
      query.where({ type });
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
