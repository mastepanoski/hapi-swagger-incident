'use strict'

module.exports = function (config) {
  return {
    plugin: {
      register: async function (server, options) {
        await server.register(require('@hapi/inert'))
        server.route({
          method: 'GET',
          path: '/files/{param*}',
          handler: {
            directory: {
              path: config.uploadDir,
              listing: true,
              index: false,
              redirectToSlash: true
            }
          }
        })
      },
      name: '@sample.FileAssets',
      version: '1.0.0'
    }
  }
}
