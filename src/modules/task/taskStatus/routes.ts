import { Router } from 'express'

import { AuthService } from '../../../services/auth'
import { TaskStatusController } from './controller'

export class TaskStatusRoutes {
  private readonly controller: TaskStatusController = new TaskStatusController()
  private authSerivce: AuthService
  private _router: Router = Router()

  public constructor(defaultStrategy?: string) {
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
      this.authSerivce.hasPermission('taskStatus', 'read'),
      this.controller.readTaskStatus
    )
  }
}
