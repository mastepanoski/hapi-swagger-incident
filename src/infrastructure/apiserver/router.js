'use strict'

const Pack = require('../../../package.json')
const path = require('path')
const glob = require('glob')
const Topo = require('@hapi/topo')
const util = require('util')

module.exports = function (config, context) {
  const mods = glob.sync('**/infrastructure/config.js', {
    cwd: path.resolve('src', 'modules'),
    absolute: true
  })

  return {
    plugin: {
      register: async (server, options) => {
        if (mods.length) {
          const plugins = new Topo.Sorter()

          mods.forEach(current => {
            try {
              let plugin = require(current)(context)

              if (Object.prototype.hasOwnProperty.call(plugin, 'plugin')) {
                plugin = plugin.plugin
              }

              if (plugin.dependencies && plugin.dependencies.length) {
                plugins.add(plugin, { after: plugin.dependencies, group: plugin.name })
              } else {
                plugins.add(plugin, { group: plugin.name })
              }
            } catch (error) {
              console.error(`[${Pack.name}] - ${Date.now()} - Error loading module ${current}: ${util.inspect(error)}`)
            }
          })

          await server.register(plugins.nodes, options)
        }

        await server.register(require('./staticfiles')(config), options)
      },
      name: '@sample.ModsLoader',
      version: '1.0.0'
    }
  }
}
