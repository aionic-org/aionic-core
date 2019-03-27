import { Router } from 'express'

import { AuthService, PassportStrategy } from '@services/auth'

import { TaskProjectController } from './controller'

export class TaskProjectRoutes {
  protected readonly controller: TaskProjectController = new TaskProjectController()
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
      '/projects',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('taskProject', 'read'),
      this.controller.readTaskProjects
    )
  }
}
