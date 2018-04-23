'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  path: '/auth/sign-in',
  method: 'POST',
  options: {
    description: 'Sign in',
    tags: ['api', 'auth'],
    auth: false,
    validate: {
      payload: {
        login: Joi.string(),
        password: Joi.string().required(),
      },
    },
    response: {
      modify: true,
      options: {
        stripUnknown: true,
      },
      schema: {
        id: Joi.number(),
        token: Joi.string(),
      },
    },
  },
  handler: async function(request) {
    const { User } = request.models();

    const user = await User
      .query()
      .joinRelation('credentials')
      .where({username: request.payload.login})
      .orWhere({email: request.payload.login})
      .first();

    if (!user) {
      return Boom.badRequest('Invalid credentials');
    }

    const hashedPassword = this.password.generateHash(request.payload.password, user.salt);

    const isPasswordCorrect = await user
      .$relatedQuery('credentials')
      .where({password: hashedPassword})
      .first();

    if (!isPasswordCorrect) {
      return Boom.badRequest('Invalid credentials');
    }

    return {
      id: user.id,
      token: '',
    };
  },
};
