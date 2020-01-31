'use strict'

module.exports = function (globalConfig) {
  const dependencies = new Map()

  return Object.freeze({
    globalConfig,
    getDependency: key => dependencies.get(key),
    addDependency: (key, cnt) => {
      dependencies.set(key, cnt)
    }
  })
}
