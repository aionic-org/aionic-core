import { Router } from 'express'

import { AuthService, PassportStrategy } from '@services/auth'
import { TaskTypeController } from './controller'

export class TaskTypeRoutes {
  private readonly controller: TaskTypeController = new TaskTypeController()
  private authSerivce: AuthService
  private _router: Router = Router()

  public constructor(defaultStrategy?: PassportStrategy) {
    this.authSerivce = new AuthService(defaultStrategy)
    this.initRoutes()
  }

  public get router(): Router {
    return this._router
  }

  private initRoutes(): void {
    this.router.get(
      '/',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('taskType', 'read'),
      this.controller.readTaskType
    )
  }
}
