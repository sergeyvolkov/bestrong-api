'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/products/${productId}',
  method: 'GET',
  options: {
    description: 'Get product details',
    tags: ['api', 'food-tracker'],
    auth: 'jwt:access',
    validate: {
      params: {
        productId: Joi.number(),
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
        title: Joi.string(),
        portionCount: Joi.number(),
        portionUnit: Joi.any().valid('g', 'piece', 'glass'),
        foodComponents: Joi.array().items({
          id: Joi.number(),
          title: Joi.string(),
          value: Joi.number(),
        }),
      },
    },
  },
  handler: async function (request) {
    const { Product } = request.models();

    const productDetails = await Product
      .query()
      .leftJoinRelation('productComponents')
      .eager('[productComponents, productComponents.foodComponent]')
      .findOne({
        'product.id': request.params.productId,
        userId: request.auth.credentials.id,
      })
      .throwIfNotFound();

    return {
      id: productDetails.id,
      title: productDetails.title,
      portionCount: productDetails.portionCount,
      portionUnit: productDetails.portionUnit,
      foodComponents: productDetails.productComponents.map(productComponent => ({
        id: productComponent.id,
        title: productComponent.foodComponent.title,
        value: productComponent.componentValue,
      })),
    };
  },
};
