import { Router } from 'express'

import { AuthService } from '../../services/auth.service'
import { TaskController } from './task.controller'
import { TaskCommentRoutes } from './subs/comment/taskComment.routes'

export class TaskRoutes {
  private readonly controller: TaskController = new TaskController()
  private authSerivce: AuthService
  private _router: Router = new Router()

  public constructor(defaultStrategy?: string) {
    this.authSerivce = new AuthService(defaultStrategy)

    this.initSubRoutes(defaultStrategy)
    this.initRoutes()
  }

  public get router(): Router {
    return this._router
  }

  private initSubRoutes(defaultStrategy?: string): void {
    this.router.use(new TaskCommentRoutes(defaultStrategy).router)
  }

  private initRoutes(): void {
    this.router.get(
      '/',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'read'),
      this.controller.readTasks
    )

    this.router.get(
      '/:id',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'read'),
      this.controller.readTask
    )

    this.router.post(
      '/',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'create'),
      this.controller.createTask
    )

    this.router.post(
      '/:id',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'update'),
      this.controller.updateTask
    )

    this.router.delete(
      '/:id',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'delete'),
      this.controller.deleteTask
    )
  }
}
