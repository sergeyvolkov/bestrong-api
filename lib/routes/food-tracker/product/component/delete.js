'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/products/${productId}/components/${productComponentId}',
  method: 'DELETE',
  options: {
    description: 'Delete a product component',
    tags: ['api', 'food-tracker'],
    auth: 'jwt:access',
    validate: {
      params: {
        productId: Joi.number(),
        productComponentId: Joi.number(),
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
    const { ProductComponent } = request.models();

    // @todo check is product already used
    await ProductComponent
      .query()
      .delete()
      .findOne({
        id: request.params.productComponentId,
        productId: request.params.productId,
      })
      .throwIfNotFound();

    return h.response();
  },
};
