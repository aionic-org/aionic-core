import { Router } from 'express'

import { AuthService } from '../../../services/auth'
import { TaskPriorityController } from './controller'

export class TaskPriorityRoutes {
  private readonly controller: TaskPriorityController = new TaskPriorityController()
  private authSerivce: AuthService
  private _router: Router = new Router()

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
      this.authSerivce.hasPermission('taskPriority', 'read'),
      this.controller.readTaskPriorities
    )
  }
}
