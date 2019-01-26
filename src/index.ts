import 'reflect-metadata'

import { config } from 'dotenv'
config()

import { createServer } from 'http'
import { createConnection } from 'typeorm'

import { env } from './config/globals'
import { logger } from './config/logger'

import { Server } from './server'

createConnection()
  .then(() => {
    logger.info('Initializing ORM connection...')

    // init express server
    const app = new Server().app
    const server = createServer(app)
    const port = env.NODE_PORT

    server.listen(port)

    server.on('listening', () => {
      logger.info(`Server is listening on port ${port} in ${env.NODE_ENV} mode`)
    })

    server.on('close', () => {
      logger.info('Server closed')
    })
  })
  .catch(err => {
    logger.error(err)
  })
