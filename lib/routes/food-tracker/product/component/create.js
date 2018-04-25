'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/product/${productId}/component',
  method: 'POST',
  options: {
    description: 'Create a new product component',
    tags: ['api', 'food-tracker'],
    auth: 'jwt:access',
    validate: {
      params: {
        productId: Joi.number(),
      },
      payload: {
        componentId: Joi.number().required(),
        componentValue: Joi.number().required(),
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
  handler: async function (request) {
    const { ProductComponent } = request.models();

    return await ProductComponent
      .query()
      .insertAndFetch({
        ...request.payload,
        productId: request.params.productId,
      });
  },
};
