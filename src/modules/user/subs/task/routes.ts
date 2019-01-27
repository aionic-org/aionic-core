import { Router } from 'express'

import { AuthService } from '../../../../services/auth'
import { UserTaskController } from './controller'

export class UserTaskRoutes {
  private authSerivce: AuthService
  private readonly _router: Router = Router()
  private readonly controller: UserTaskController = new UserTaskController()

  public constructor(defaultStrategy?: string) {
    this.authSerivce = new AuthService(defaultStrategy)
    this.initRoutes()
  }

  public get router(): Router {
    return this._router
  }

  private initRoutes() {
    this._router.get(
      '/:id/tasks',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('userTask', 'read'),
      this.controller.readUserTasks
    )

    this._router.get(
      '/:userId/tasks/status/:statusId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('userTask', 'read'),
      this.controller.readUserTasksByStatus
    )
  }
}
