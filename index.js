'use strict'

const Hoek = require('@hapi/hoek')

const Pack = require('./package.json')
const ServerBuilder = require('./src/infrastructure/apiserver')

const start = async function () {
  try {
    const server = await new ServerBuilder().build()
    await server.start()
    console.log(`${Pack.name} is running on: ${server.info.uri}`)
  } catch (err) {
    Hoek.assert(!err, err)
  }
}

start()
