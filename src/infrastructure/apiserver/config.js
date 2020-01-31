'use strict'

const path = require('path')
const fs = require('fs')

const deployEnv = path.resolve('deploy', '.env')

// Load environment variables from .env
require('dotenv').config({
  path: process.env.NODE_ENV !== 'test' ? (fs.existsSync(deployEnv) ? deployEnv : path.resolve('.env')) : '.env.test'
})

const config = {
  port: process.env.APP_PORT || 3000,
  host: process.env.APP_HOST || '127.0.0.1',
  debug: process.env.APP_DEBUG === 'true',
  uploadDir: process.env.APP_UPLOAD_PROFILES_DIR ? path.resolve(process.env.APP_UPLOAD_PROFILES_DIR) : path.resolve('public', 'files'),
  api: {
    validVersions: process.env.API_VALID_VERSIONS ? JSON.parse(process.env.API_DEFAULT_VERSIONS) : [1],
    defaultVersion: process.env.API_DEFAULT_VERSION || 1
  },
  auth: {
    jwt: {
      secretKey: process.env.API_JWT_SECRET_KEY || 'secretkey',
      expiresIn: 60
    }
  }
}

module.exports = Object.freeze(config)
