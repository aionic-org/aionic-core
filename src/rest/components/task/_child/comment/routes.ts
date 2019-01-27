import { Router } from 'express'

import { AuthService, PassportStrategy } from '../../../../../services/auth'

import { TaskCommentController } from './controller'

export class TaskCommentRoutes {
  protected readonly controller: TaskCommentController = new TaskCommentController()
  protected authSerivce: AuthService
  private _router: Router = Router({ mergeParams: true })

  public constructor(defaultStrategy?: PassportStrategy) {
    this.authSerivce = new AuthService(defaultStrategy)
    this.initRoutes()
  }

  public get router(): Router {
    return this._router
  }

  private initRoutes(): void {
    this.router.get(
      '/comments',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('taskComment', 'read'),
      this.controller.readTaskComments
    )

    this.router.post(
      '/comments',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('taskComment', 'create'),
      this.controller.createTaskComment
    )

    this.router.delete(
      '/comments/:commentId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('taskComment', 'delete'),
      this.controller.deleteTaskComment
    )
  }
}
