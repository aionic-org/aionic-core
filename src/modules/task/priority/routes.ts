import { Router } from 'express'

import { AuthService, PassportStrategy } from '../../../services/auth'
import { TaskPriorityController } from './controller'

export class TaskPriorityRoutes {
  private readonly controller: TaskPriorityController = new TaskPriorityController()
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
      this.authSerivce.hasPermission('taskPriority', 'read'),
      this.controller.readTaskPriorities
    )
  }
}
