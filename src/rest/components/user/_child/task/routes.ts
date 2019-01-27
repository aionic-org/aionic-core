import { Router } from 'express'

import { AuthService, PassportStrategy } from '../../../../../services/auth'
import { UserTaskController } from './controller'

export class UserTaskRoutes {
  private authSerivce: AuthService
  private readonly _router: Router = Router({ mergeParams: true })
  private readonly controller: UserTaskController = new UserTaskController()

  public constructor(defaultStrategy?: PassportStrategy) {
    this.authSerivce = new AuthService(defaultStrategy)
    this.initRoutes()
  }

  public get router(): Router {
    return this._router
  }

  private initRoutes() {
    this._router.get(
      '/tasks',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('userTask', 'read'),
      this.controller.readUserTasks
    )

    this._router.get(
      '/tasks/status/:statusId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('userTask', 'read'),
      this.controller.readUserTasksByStatus
    )
  }
}
