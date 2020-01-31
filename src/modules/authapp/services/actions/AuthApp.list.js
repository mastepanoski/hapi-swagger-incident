'use strict'

const actionFactory = require('@quickwire/moduledef/providerActionFactory')

module.exports = ({
  authAppRepository
}) => (authAppSearch = {}) => {
  return actionFactory(async () => {
    const authAppList = await authAppRepository.find(authAppSearch)
    return authAppList
  })
}
