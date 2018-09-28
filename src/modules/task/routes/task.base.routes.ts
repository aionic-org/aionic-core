import { Router } from 'express'

import { AuthService } from '../../../services/auth.service'
import { TaskController } from '../controllers/task.controller'

export class TaskBaseRoutes {
  protected readonly controller: TaskController = new TaskController()
  protected authSerivce: AuthService
  private _router: Router = new Router()

  public constructor(defaultStrategy?: string) {
    this.authSerivce = new AuthService(defaultStrategy)
    this.initDetailsRoutes()
  }

  public get router(): Router {
    return this._router
  }

  private initDetailsRoutes(): void {
    this.router.get(
      '/base',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'read'),
      this.controller.readTasks
    )

    this.router.get(
      '/base/:id',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'read'),
      this.controller.readTask
    )

    this.router.post(
      '/base/',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'create'),
      this.controller.createTask
    )

    this.router.put(
      '/base/:id',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'update'),
      this.controller.updateTask
    )

    this.router.delete(
      '/base/:id',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'delete'),
      this.controller.deleteTask
    )
  }
}
