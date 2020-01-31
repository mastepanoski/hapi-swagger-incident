'use strict'

const uuidv1 = require('uuid/v1')

const {
  triggerValidationError
} = require('@quickwire/moduledef/normalizeError')
const localeService = require('@quickwire/i18n')()
const actionFactory = require('@quickwire/moduledef/providerActionFactory')

module.exports = ({
  authAppRepository
}) => ({
  app_name: appName
}) => {
  return actionFactory(async () => {
    appName = appName.trim()

    if (!appName || appName.length < 3) {
      triggerValidationError(localeService.t('TOO_SHORT_APP_NAME'))
    }

    const authAppPage = await authAppRepository.find({
      app_name: appName,
      page: 1,
      limit: 1
    })

    if (authAppPage && authAppPage.total) {
      triggerValidationError(localeService.t('APP_NAME_ALREADY_EXISTS'))
    }

    const authAppList = await authAppRepository.create({
      app_key: uuidv1(appName),
      app_name: appName
    })

    return authAppList
  })
}
