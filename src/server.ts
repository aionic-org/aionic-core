import * as express from 'express'
import * as helmet from 'helmet'
import * as bodyParser from 'body-parser'
import * as cors from 'cors'

import { AuthService } from './services/auth'

// auth routes
import { AuthRoutes } from './modules/auth/routes'

// user routes
import { UserRoutes } from './modules/user/routes'
import { UserInvitationRoutes } from './modules/user/userInvitation/routes'
import { UserRoleRoutes } from './modules/user/userRole/routes'

// task routes
import { TaskRoutes } from './modules/task/routes'
import { TaskPriorityRoutes } from './modules/task/taskPriority/routes'
import { TaskStatusRoutes } from './modules/task/taskStatus/routes'

export class Server {
  private readonly _app: express.Application = express()
  private readonly authService: AuthService = new AuthService()

  public constructor() {
    this.initConfig()
    this.initRoutes()
  }

  public get app(): express.Application {
    return this._app
  }

  private initConfig(): void {
    this._app.use(helmet())
    this._app.use(cors({ origin: 'http://localhost:4200' }))
    this._app.use(bodyParser.json())
    this._app.use(bodyParser.urlencoded({ extended: true }))

    // setup passport strategies
    this.authService.initStrategies()
  }

  private initRoutes(): any {
    // api endpoints - pass optional passport default strategy
    this._app.use('/api/auth', new AuthRoutes().router)

    // user
    this._app.use('/api/user', new UserRoutes().router)
    this._app.use('/api/userInvitation', new UserInvitationRoutes().router)
    this._app.use('/api/userRole', new UserRoleRoutes().router)

    // task
    this._app.use('/api/task', new TaskRoutes().router)
    this._app.use('/api/taskPriority', new TaskPriorityRoutes().router)
    this._app.use('/api/taskStatus', new TaskStatusRoutes().router)

    // error handler
    this._app.use((err, req, res, next) => {
      console.log(err)
      return res.status(500).json({
        status: 500,
        error: typeof err === 'object' ? err.message : err
      })
    })
  }
}
