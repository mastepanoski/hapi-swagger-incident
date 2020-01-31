'use strict'

const {
  triggerValidationError
} = require('@quickwire/moduledef/normalizeError')
const localeService = require('@quickwire/i18n')()
const actionFactory = require('@quickwire/moduledef/providerActionFactory')

module.exports = ({
  authAppRepository
}) => ({ id }) => {
  return actionFactory(async () => {
    const authAppPage = await authAppRepository.find({
      page: 1,
      limit: 1,
      id
    })

    if (!authAppPage || !authAppPage.total) {
      triggerValidationError(localeService.t('APP_NOT_EXIST'))
    }

    const authAppList = await authAppRepository.remove({ id })
    return authAppList
  })
}
