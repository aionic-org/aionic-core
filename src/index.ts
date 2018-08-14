import 'reflect-metadata'
import { createServer } from 'http'
import { createConnection } from 'typeorm'

import { Server } from './server'
import { variables } from './config/globals'

createConnection()
  .then(connection => {
    console.log('Initializing ORM connection...')

    // init express server
    const app = new Server().app
    const server = createServer(app)
    const port = variables.port

    server.listen(port)

    server.on('listening', () => {
      console.log(`Server is listening on port ${port}`)
    })

    server.on('close', () => {
      console.log('Server closed')
    })

    server.on('error', err => {
      throw new Error(err.message)
    })
  })
  .catch(err => {
    console.log(err)
  })
