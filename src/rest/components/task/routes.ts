import { Router } from 'express'

import { AuthService, PassportStrategy } from '@services/auth'

import { TaskController } from './controller'

import { TaskCommentRoutes } from './_child/comment/routes'

export class TaskRoutes {
  private readonly controller: TaskController = new TaskController()
  private authSerivce: AuthService
  private _router: Router = Router()

  public constructor(defaultStrategy?: PassportStrategy) {
    this.authSerivce = new AuthService(defaultStrategy)

    this.initRoutes()
    this.initChildRoutes(defaultStrategy)
  }

  public get router(): Router {
    return this._router
  }

  private initRoutes(): void {
    this.router.get(
      '/',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'read'),
      this.controller.readTasks
    )

    this.router.get(
      '/:taskId',
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

    this.router.put(
      '/:taskId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'update'),
      this.controller.updateTask
    )

    this.router.delete(
      '/:taskId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('task', 'delete'),
      this.controller.deleteTask
    )
  }

  private initChildRoutes(defaultStrategy?: PassportStrategy): void {
    this.router.use('/:taskId', new TaskCommentRoutes(defaultStrategy).router)
  }
}
