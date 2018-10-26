import { Router } from 'express'

import { AuthService } from '../../services/auth'
import { UserController } from './controller'
import { UserTaskRoutes } from './subs/task/routes'

export class UserRoutes {
  private authSerivce: AuthService
  private readonly _router: Router = new Router()
  private readonly controller: UserController = new UserController()

  public constructor(defaultStrategy?: string) {
    this.authSerivce = new AuthService(defaultStrategy)

    this.initSubRoutes(defaultStrategy)
    this.initRoutes()
  }

  public get router(): Router {
    return this._router
  }

  private initSubRoutes(defaultStrategy?: string): void {
    this.router.use(new UserTaskRoutes(defaultStrategy).router)
  }

  private initRoutes() {
    this._router.get(
      '/',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('user', 'read'),
      this.controller.readUsers
    )

    this._router.get(
      '/:id',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('user', 'read'),
      this.controller.readUser
    )
  }
}
