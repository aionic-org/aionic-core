import { Router } from 'express'

import { AuthService, PassportStrategy } from '@services/auth'

import { ProjectController } from './controller'

export class ProjectRoutes {
  private readonly controller: ProjectController = new ProjectController()
  private authSerivce: AuthService
  private _router: Router = Router()

  public constructor(defaultStrategy?: PassportStrategy) {
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
      this.authSerivce.hasPermission('project', 'read'),
      this.controller.readProjects
    )

    this.router.get(
      '/:projectId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('project', 'read'),
      this.controller.readProject
    )

    this.router.post(
      '/',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('project', 'create'),
      this.controller.createProject
    )

    this.router.put(
      '/:projectId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('project', 'update'),
      this.controller.updateProject
    )

    this.router.delete(
      '/:projectId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('project', 'delete'),
      this.controller.deleteProject
    )
  }
}
