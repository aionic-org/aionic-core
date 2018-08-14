import { Router } from 'express'

import { AuthService } from '../../../services/auth.service'
import { TaskController } from '../controllers/task.controller'

export class TaskRoutes {
  private authSerivce: AuthService
  private readonly _router: Router = new Router()
  private readonly controller: TaskController = new TaskController()

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
      this.authSerivce.hasPermission('task', 'read'),
      this.controller.readTasks
    )

    this._router.get(
      '/:id',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'read'),
      this.controller.readTask
    )

    this._router.post(
      '/',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'create'),
      this.controller.createTask
    )

    this._router.put(
      '/:id',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'update'),
      this.controller.updateTask
    )

    this._router.delete(
      '/:id',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'delete'),
      this.controller.deleteTask
    )
  }
}
