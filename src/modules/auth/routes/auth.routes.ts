import { Router } from 'express'

// services import
import { AuthService } from '../../../services/auth.service'

import { AuthController } from '../controllers/auth.controller'

export class AuthRoutes {
  private authSerivce: AuthService
  private readonly _router: Router = new Router()
  private readonly controller: AuthController = new AuthController()

  public constructor(defaultStrategy?: string) {
    this.authSerivce = new AuthService(defaultStrategy)
    this.initRoutes()
  }

  public get router(): Router {
    return this._router
  }

  private initRoutes() {
    this._router.post('/signin', this.controller.signin)
    this._router.get('/register/:hash', this.controller.validateHash)
    this._router.post('/register/:hash', this.controller.register)
    this._router.post('/invitation', this.controller.createInvitation)
    this._router.post('/unregister', this.authSerivce.isAuthorized(), this.controller.unregister)
  }
}
