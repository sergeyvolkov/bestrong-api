'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/product/${productId}/component/${foodComponentId}',
  method: 'DELETE',
  options: {
    description: 'Delete a product component',
    tags: ['api', 'food-tracker'],
    auth: 'jwt:access',
    validate: {
      params: {
        productId: Joi.number(),
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
    const { ProductComponent } = request.models();

    // @todo check is product already used
    await ProductComponent
      .query()
      .delete()
      .findOne({
        componentId: request.params.foodComponentId,
        productId: request.params.productId,
      })
      .throwIfNotFound();

    return h.response();
  },
};
