'use strict';

const Boom = require('boom');
const Joi = require('joi');

module.exports = {
  path: '/auth/sign-up',
  method: 'POST',
  options: {
    description: 'Sign up with login/password',
    tags: ['api', 'auth'],
    auth: false,
    validate: {
      payload: {
        username: Joi.string().required().description('Username'),
        email: Joi.string().email().required().description('Email'),
        password: Joi.string().required().description('Password'),
      },
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
    const { User } = request.models();

    const {
      username,
      email,
      password,
    } = request.payload;

    const isUsernameNotUnique = await User
      .query()
      .where({username})
      .first();

    if (isUsernameNotUnique) {
      return Boom.conflict('User with this username already exists');
    }

    const isEmailNotUnique = await User
      .query()
      .where({email})
      .first();

    if (isEmailNotUnique) {
      return Boom.conflict('User with this email already exists');
    }

    const salt = this.password.generateSalt();
    const hashedPassword = this.password.generateHash(password, salt);

    return await User
      .query()
      .insertGraphAndFetch({
        username,
        email,
        salt,
        credentials: [{
          password: hashedPassword,
        }],
      });
  },
};
