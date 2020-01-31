'use strict'

const faker = require('faker')

const config = require('@quickwire/apiserver/config')
const {
  SERVICE_SUCCESS,
  SERVICE_VALIDATION_ERROR,
  SERVICE_ERROR
} = require('@quickwire/moduledef/constants')
const AuthAppRepository = require('../../infrastructure/repositories/AuthApp.repository')
const AuthAppProvider = require('../AuthApp.provider')

const {
  getNewAuthApp
} = require('../../infrastructure/repositories/__fixtures__/authorizedApps')

/* global describe */
/* global beforeAll */
/* global afterAll */
/* global expect */
/* global it */
/* global jasmine */

jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000

const WAIT_FOR_STOP = jasmine.DEFAULT_TIMEOUT_INTERVAL - 2000

describe('Testing authAppProvider', () => {
  let authAppRepository = null
  let authAppProvider = null
  const sampleApps = []

  beforeAll(() => {
    for (let index = 0; index < 30; index++) {
      sampleApps.push(getNewAuthApp())
    }

    authAppRepository = AuthAppRepository.build({ globalConfig: config })

    authAppProvider = AuthAppProvider({
      authAppRepository
    })
  })

  it('It should add an authorized app', async () => {
    for (let i = 0; i < sampleApps.length; i++) {
      const result = await new Promise((resolve, reject) => {
        // Poner un timer, porque sino se obtiene el evento esperado (antes fallas), se quedará colgado esperando sino.
        const timer = setTimeout(() => {
          resolve(null)
        }, WAIT_FOR_STOP)

        authAppProvider.appendApp(sampleApps[i])
          .on(SERVICE_SUCCESS, result => {
            clearTimeout(timer)
            resolve(result)
          })
          .on(SERVICE_VALIDATION_ERROR, error => {
            clearTimeout(timer)
            console.error('Error de validación: ' + error)
            reject(error)
          })
          .on(SERVICE_ERROR, error => {
            clearTimeout(timer)
            console.error('Error desconocido: ' + error)
            reject(error)
          })
      })

      expect(result).toHaveProperty('id')
      expect(result).toHaveProperty('app_key')
      expect(result).toHaveProperty('app_name', sampleApps[i].app_name)
      expect(result).toHaveProperty('created_at')
      expect(result).toHaveProperty('updated_at')

      sampleApps[i] = result
    }
  })

  it('It should return a list of authorized apps', async () => {
    const result = await new Promise((resolve, reject) => {
      // Poner un timer, porque sino se obtiene el evento esperado (antes fallas), se quedará colgado esperando sino.
      const timer = setTimeout(() => {
        resolve(null)
      }, WAIT_FOR_STOP)

      authAppProvider.list()
        .on(SERVICE_SUCCESS, result => {
          clearTimeout(timer)
          resolve(result)
        })
        .on(SERVICE_VALIDATION_ERROR, error => {
          clearTimeout(timer)
          console.error('Error de validación: ' + error)
          reject(error)
        })
        .on(SERVICE_ERROR, error => {
          clearTimeout(timer)
          console.error('Error desconocido: ' + error)
          reject(error)
        })
    })

    expect(result).toHaveProperty('collection')
    expect(result).toHaveProperty('total')
    expect(result).toHaveProperty('page')
    expect(result).toHaveProperty('limit')

    for (const aApp of result.collection) {
      expect(aApp).toHaveProperty('id')
      expect(aApp).toHaveProperty('app_key')
      expect(aApp).toHaveProperty('app_name')
      expect(aApp).toHaveProperty('created_at')
      expect(aApp).toHaveProperty('updated_at')
    }
  })

  it('It should return a single app by App Key in a page', async () => {
    const toFind = sampleApps[faker.random.number({
      min: 0,
      max: sampleApps.length - 1
    })]

    const result = await new Promise((resolve, reject) => {
      // Poner un timer, porque sino se obtiene el evento esperado (antes fallas), se quedará colgado esperando sino.
      const timer = setTimeout(() => {
        resolve(null)
      }, WAIT_FOR_STOP)

      authAppProvider.list({
        app_key: toFind.app_key,
        limit: 1,
        page: 1
      })
        .on(SERVICE_SUCCESS, result => {
          clearTimeout(timer)
          resolve(result)
        })
        .on(SERVICE_VALIDATION_ERROR, error => {
          clearTimeout(timer)
          console.error('Error de validación: ' + error)
          reject(error)
        })
        .on(SERVICE_ERROR, error => {
          clearTimeout(timer)
          console.error('Error desconocido: ' + error)
          reject(error)
        })
    })

    expect(result).toHaveProperty('collection')
    expect(result).toHaveProperty('total', 1)
    expect(result).toHaveProperty('page', 1)
    expect(result).toHaveProperty('limit', 1)
    expect(result.collection.length).toEqual(1)

    for (const aApp of result.collection) {
      expect(aApp).toHaveProperty('id', toFind.id)
      expect(aApp).toHaveProperty('app_key', toFind.app_key)
      expect(aApp).toHaveProperty('app_name', toFind.app_name)
      expect(aApp).toHaveProperty('created_at')
      expect(aApp).toHaveProperty('updated_at')
    }
  })

  it('It should return a single app by ID in a page', async () => {
    const toFind = sampleApps[faker.random.number({
      min: 0,
      max: sampleApps.length - 1
    })]

    const result = await new Promise((resolve, reject) => {
      // Poner un timer, porque sino se obtiene el evento esperado (antes fallas), se quedará colgado esperando sino.
      const timer = setTimeout(() => {
        resolve(null)
      }, WAIT_FOR_STOP)

      authAppProvider.list({
        id: toFind.id,
        limit: 1,
        page: 1
      })
        .on(SERVICE_SUCCESS, result => {
          clearTimeout(timer)
          resolve(result)
        })
        .on(SERVICE_VALIDATION_ERROR, error => {
          clearTimeout(timer)
          console.error('Error de validación: ' + error)
          reject(error)
        })
        .on(SERVICE_ERROR, error => {
          clearTimeout(timer)
          console.error('Error desconocido: ' + error)
          reject(error)
        })
    })

    expect(result).toHaveProperty('collection')
    expect(result).toHaveProperty('total', 1)
    expect(result).toHaveProperty('page', 1)
    expect(result).toHaveProperty('limit', 1)
    expect(result.collection.length).toEqual(1)

    for (const aApp of result.collection) {
      expect(aApp).toHaveProperty('id', toFind.id)
    }
  })

  it('It should not return an app if it does not exist', async () => {
    const result = await new Promise((resolve, reject) => {
      // Poner un timer, porque sino se obtiene el evento esperado (antes fallas), se quedará colgado esperando sino.
      const timer = setTimeout(() => {
        resolve(null)
      }, WAIT_FOR_STOP)

      authAppProvider.list({
        id: faker.random.uuid(),
        limit: 1,
        page: 1
      })
        .on(SERVICE_SUCCESS, result => {
          clearTimeout(timer)
          resolve(result)
        })
        .on(SERVICE_VALIDATION_ERROR, error => {
          clearTimeout(timer)
          console.error('Error de validación: ' + error)
          reject(error)
        })
        .on(SERVICE_ERROR, error => {
          clearTimeout(timer)
          console.error('Error desconocido: ' + error)
          reject(error)
        })
    })

    expect(result).toHaveProperty('collection')
    expect(result).toHaveProperty('total', 0)
    expect(result).toHaveProperty('page', 1)
    expect(result).toHaveProperty('limit', 1)
    expect(result.collection.length).toEqual(0)
  })

  it('It should fail to add an existing app', async () => {
    const eApp = sampleApps[0]

    try {
      await new Promise((resolve, reject) => {
        // Poner un timer, porque sino se obtiene el evento esperado (antes fallas), se quedará colgado esperando sino.
        const timer = setTimeout(() => {
          resolve(null)
        }, WAIT_FOR_STOP)

        authAppProvider.appendApp({
          app_name: eApp.app_name
        })
          .on(SERVICE_SUCCESS, result => {
            clearTimeout(timer)
            resolve(result)
          })
          .on(SERVICE_VALIDATION_ERROR, error => {
            clearTimeout(timer)
            reject(error)
          })
          .on(SERVICE_ERROR, error => {
            clearTimeout(timer)
            console.error('Error desconocido: ' + error)
            reject(error)
          })
      })
    } catch (err) {
      expect(err.message.indexOf('Ya existe una aplicación con el nombre suministrado')).toBeGreaterThanOrEqual(0)
    }
  })

  it('It should remove a single app', async () => {
    const toFind = sampleApps[faker.random.number({
      min: 0,
      max: sampleApps.length - 1
    })]

    const result = await new Promise((resolve, reject) => {
      // Poner un timer, porque sino se obtiene el evento esperado (antes fallas), se quedará colgado esperando sino.
      const timer = setTimeout(() => {
        resolve(null)
      }, WAIT_FOR_STOP)

      authAppProvider.removeApp({
        id: toFind.id,
        limit: 1,
        page: 1
      })
        .on(SERVICE_SUCCESS, result => {
          clearTimeout(timer)
          resolve(result)
        })
        .on(SERVICE_VALIDATION_ERROR, error => {
          clearTimeout(timer)
          console.error('Error de validación: ' + error)
          reject(error)
        })
        .on(SERVICE_ERROR, error => {
          clearTimeout(timer)
          console.error('Error desconocido: ' + error)
          reject(error)
        })
    })

    expect(result).toHaveProperty('id')
    expect(result).toHaveProperty('app_key', toFind.app_key)
    expect(result).toHaveProperty('app_name', toFind.app_name)
    expect(result).toHaveProperty('created_at')
    expect(result).toHaveProperty('updated_at')

    const result2 = await new Promise((resolve, reject) => {
      // Poner un timer, porque sino se obtiene el evento esperado (antes fallas), se quedará colgado esperando sino.
      const timer = setTimeout(() => {
        resolve(null)
      }, WAIT_FOR_STOP)

      authAppProvider.list({
        id: toFind.id,
        limit: 1,
        page: 1
      })
        .on(SERVICE_SUCCESS, result => {
          clearTimeout(timer)
          resolve(result)
        })
        .on(SERVICE_VALIDATION_ERROR, error => {
          clearTimeout(timer)
          console.error('Error de validación: ' + error)
          reject(error)
        })
        .on(SERVICE_ERROR, error => {
          clearTimeout(timer)
          console.error('Error desconocido: ' + error)
          reject(error)
        })
    })

    expect(result2).toHaveProperty('collection')
    expect(result2).toHaveProperty('total', 0)
    expect(result2).toHaveProperty('page', 1)
    expect(result2).toHaveProperty('limit', 1)
    expect(result2.collection.length).toEqual(0)
  })

  afterAll(() => {
    authAppRepository = null
  })
})
