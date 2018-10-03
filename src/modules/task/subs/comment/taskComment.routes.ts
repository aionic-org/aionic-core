import { Router } from 'express'

import { AuthService } from '../../../../services/auth.service'
import { TaskCommentController } from './taskComment.controller'

export class TaskCommentRoutes {
  protected readonly controller: TaskCommentController = new TaskCommentController()
  protected authSerivce: AuthService
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
      '/:id/comments',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('taskComment', 'read'),
      this.controller.readTaskComments
    )
  }
}
