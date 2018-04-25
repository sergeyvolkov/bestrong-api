'use strict';

const Hoek = require('hoek');
const Joi = require('joi');

module.exports = {
  path: '/auth/tokens/refresh',
  method: 'POST',
  options: {
    description: 'Refresh access/refresh tokens',
    tags: ['api', 'auth'],
    auth: 'jwt:refresh',
    validate: {
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
        access: Joi.object({
          token: Joi.string(),
          expiresAt: Joi.date(),
        }),
        refresh: Joi.object({
          token: Joi.string(),
          expiresAt: Joi.date(),
        }),
      },
    },
  },
  handler: async function (request) {
    const { User } = request.models();

    const credentials = Hoek.clone(request.auth.credentials);
    const user = await User
      .query()
      .findById(request.auth.credentials.id)
      .throwIfNotFound();

    const {
      token: accessToken,
      expiresAt: accessExpiresAt,
      ...accessMetadata
    } = await this.jwt.generateAccessToken(credentials);
    const {
      token: refreshToken,
      expiresAt: refreshExpiresAt,
      ...refreshMetadata
    } = await this.jwt.generateRefreshToken(credentials);

    await user
      .$relatedQuery('sessions')
      .insertGraph({
        userId: user.id,
        tokens: [
          {
            type: 'access',
            ...accessMetadata,
          },
          {
            type: 'refresh',
            ...refreshMetadata,
          },
        ],
      });

    return {
      access: {
        token: accessToken,
        expiresAt: accessExpiresAt,
      },
      refresh: {
        token: refreshToken,
        expiresAt: refreshExpiresAt,
      },
    };
  },
};
