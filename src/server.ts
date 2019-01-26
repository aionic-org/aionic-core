import express from 'express'

import { initErrorHandler, initMiddleware } from './middleware'
import { initModuleRoutes } from './modules'

export class Server {
  private readonly _app: express.Application = express()

  public constructor() {
    initMiddleware(this._app)
    initModuleRoutes(this._app)
    initErrorHandler(this._app)
  }

  public get app(): express.Application {
    return this._app
  }
}
