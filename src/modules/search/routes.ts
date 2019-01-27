import { Router } from 'express'

import { AuthService, PassportStrategy } from '../../services/auth'

import { SearchController } from './controller'

export class SearchRoutes {
  protected readonly controller: SearchController = new SearchController()
  protected authSerivce: AuthService
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
      '/task/:searchTerm',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('search', 'read'),
      this.controller.searchTaskByDescription
    )
  }
}
