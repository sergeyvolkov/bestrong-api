'use strict';

const Joi = require('joi');

module.exports = {
  path: '/food-tracker/products',
  method: 'GET',
  options: {
    description: 'Get all products',
    tags: ['api', 'product'],
    auth: 'jwt:access',
    validate: {
      query: {
        withFoodComponents: Joi.boolean().default(false),
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
          title: Joi.string(),
          portionCount: Joi.number(),
          portionUnit: Joi.any().valid('g', 'piece', 'glass'),
          foodComponents: Joi.array().items({
            id: Joi.number(),
            title: Joi.string(),
            value: Joi.number(),
          }),
        }),
      },
    },
  },
  handler: async function (request) {
    const { Product } = request.models();

    const productQuery = Product
      .query()
      .distinct('product.*')
      .where({
        userId: request.auth.credentials.id,
      });

    if (request.query.withFoodComponents) {
      productQuery.leftJoinRelation('productComponents')
        .eager('[productComponents, productComponents.foodComponent]');
    }

    const products = await productQuery;
    const transformedProducts = products.map(productDetails => ({
      id: productDetails.id,
      title: productDetails.title,
      portionCount: productDetails.portionCount,
      portionUnit: productDetails.portionUnit,
      foodComponents: (productDetails.productComponents || []).map(productComponent => ({
        id: productComponent.id,
        title: productComponent.foodComponent.title,
        value: productComponent.componentValue,
      })),
    }));

    return {
      items: transformedProducts,
    };
  },
};
