'use strict'

const checkDependencies = require('@quickwire/moduledef/checkDependency')

const list = require('./actions/AuthApp.list')
const appendApp = require('./actions/AuthApp.append')
const removeApp = require('./actions/AuthApp.remove')

module.exports = function ({
  authAppRepository
}) {
  checkDependencies({
    authAppRepository
  })

  return {
    list: list({
      authAppRepository
    }),
    appendApp: appendApp({
      authAppRepository
    }),
    removeApp: removeApp({
      authAppRepository
    })
  }
}
