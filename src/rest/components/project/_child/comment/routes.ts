import { Router } from 'express'

import { AuthService, PassportStrategy } from '@services/auth'

import { ProjectCommentController } from './controller'

export class ProjectCommentRoutes {
  protected readonly controller: ProjectCommentController = new ProjectCommentController()
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
      '/comment',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('projectComment', 'read'),
      this.controller.readProjectComments
    )

    this.router.post(
      '/comment',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('projectComment', 'create'),
      this.controller.createProjectComment
    )

    this.router.delete(
      '/comment/:commentId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('projectComment', 'delete'),
      this.controller.deleteProjectComment
    )
  }
}
