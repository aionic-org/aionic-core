import 'reflect-metadata'

import 'module-alias/register'

// Set env variables from .env file
import { config } from 'dotenv'
config()

import { createServer } from 'http'
import { createConnection } from 'typeorm'

import { env } from '@config/globals'
import { logger } from '@config/logger'

import { Server } from './rest/server'

createConnection()
  .then(() => {
    logger.info('Initializing ORM connection...')

    // Init express server
    const app = new Server().app
    const server = createServer(app)

    // Start express server
    server.listen(env.NODE_PORT)

    server.on('listening', () => {
      logger.info(
        `Aionic (Core) server is listening on port ${env.NODE_PORT} in ${env.NODE_ENV} mode`
      )
    })

    server.on('close', () => {
      logger.info('Server closed')
    })
  })
  .catch(err => {
    logger.error(err)
  })
