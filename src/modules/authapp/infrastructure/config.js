'use strict'

const Joi = require('@hapi/joi')
const Boom = require('@hapi/boom')

module.exports = context => ({
  register: (server, options) => {
    const validate = async function (decoded, req) {
      const app = await Promise.resolve({
        name: 'sample app',
        id: '123213'
      })

      if (app) {
        return {
          credentials: app,
          isValid: true
        }
      } else {
        return {
          credentials: null,
          isValid: false
        }
      }
    }

    server.auth.strategy('jwt', 'jwt', {
      key: context.globalConfig.auth.jwt.secretKey,
      validate,
      verifyOptions: {
        algorithms: ['HS256']
      }
    })

    server.route({
      method: 'POST',
      path: '/auth-an-app',
      config: {
        plugins: {
          'hapi-swagger': {
            consumes: ['application/json'],
            payloadType: 'json',
            200: {
              description: 'Success',
              schema: Joi.object({
                id: Joi.string().required().description('ID'),
                a_key: Joi.string().required().description('App Key'),
                a_name: Joi.string().required().description('App Name')
              }).label('Result')
            },
            400: {
              description: 'BadRequest'
            }
          }
        },
        description: 'Sample endpoint',
        notes: ['Sample note'],
        tags: ['api', 'apps'],
        auth: false,
        validate: {
          payload: Joi.object({
            a_id: Joi.string().required().description('App id'),
            a_secret: Joi.string().required().description('App secret')
          })
        },
        handler: (req, h) => {
          return Boom.notImplemented('Not implemented.')
        }
      }
    })
  },
  name: 'sample-mod-authapps',
  dependencies: [],
  version: '1.0.0'
})
