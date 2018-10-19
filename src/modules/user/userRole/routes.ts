import { Router } from 'express'

import { AuthService } from '../../../services/auth'
import { UserRoleController } from './controller'

export class UserRoleRoutes {
  private authSerivce: AuthService
  private readonly _router: Router = new Router()
  private readonly controller: UserRoleController = new UserRoleController()

  public constructor(defaultStrategy?: string) {
    this.authSerivce = new AuthService(defaultStrategy)
    this.initRoutes()
  }

  public get router(): Router {
    return this._router
  }

  private initRoutes() {
    this._router.get(
      '/',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('userRole', 'read'),
      this.controller.readUserRoles
    )
  }
}
