'use strict'

require('module-alias/register')

const Hapi = require('@hapi/hapi')
const Inert = require('@hapi/inert')
const Vision = require('@hapi/vision')
const HapiSwagger = require('hapi-swagger')
const JWT2Auth = require('hapi-auth-jwt2')
const util = require('util')

const config = require('./config')
const context = require('../moduledef/defineContext')(config)
const routes = require('./router')(config, context)

const Pack = require('@sample/package.json')

class ServerBuilder {
  constructor () {
    this._server = new Hapi.Server({
      port: config.port,
      host: config.host,
      routes: {
        validate: {
          failAction: async (request, h, err) => {
            if (process.env.NODE_ENV === 'production') {
              // In prod, log a limited error message and throw the default Bad Request error.
              console.error('ValidationError:', err.message) // Better to use an actual logger here.
              throw err
            } else {
              // During development, log and respond with the full error.
              console.error(util.inspect(err))
              throw err
            }
          }
        }
      }
    })
  }

  getContext () {
    return context
  }

  async build () {
    const swaggerOptions = {
      info: {
        title: `${Pack.name} API Documentation`,
        version: Pack.version
      },
      sortEndpoints: 'ordered',
      grouping: 'tags'
    }

    await this._server.validator(require('@hapi/joi'))
    await this._server.register([
      Inert,
      Vision,
      JWT2Auth,
      {
        plugin: require('hapi-api-version'),
        options: {
          validVersions: config.api.validVersions,
          defaultVersion: config.api.defaultVersion,
          vendorName: Pack.name
        }
      }, {
        plugin: HapiSwagger,
        options: swaggerOptions
      },
      routes
    ])

    return this._server
  }

  stop () {
    /* This function is usefull for testing to close gracefully all open handles */
  }
}

module.exports = ServerBuilder
