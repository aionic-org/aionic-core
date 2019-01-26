import { Router } from 'express'

import { AuthService } from '../../../../services/auth'

import { TaskCommentController } from './controller'

export class TaskCommentRoutes {
  protected readonly controller: TaskCommentController = new TaskCommentController()
  protected authSerivce: AuthService
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
      '/:id/comments',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('taskComment', 'read'),
      this.controller.readTaskComments
    )

    this.router.post(
      '/:id/comments',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('taskComment', 'create'),
      this.controller.createTaskComment
    )

    this.router.delete(
      '/comments/:id',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('taskComment', 'delete'),
      this.controller.deleteTaskComment
    )
  }
}
