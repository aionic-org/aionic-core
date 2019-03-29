import { Router } from 'express'

import { AuthService, PassportStrategy } from '@services/auth'

import { UserInvitationController } from './controller'

export class UserInvitationRoutes {
  private authSerivce: AuthService
  private readonly _router: Router = Router()
  private readonly controller: UserInvitationController = new UserInvitationController()

  public constructor(defaultStrategy?: PassportStrategy) {
    this.authSerivce = new AuthService(defaultStrategy)
    this.initRoutes()
  }

  public get router(): Router {
    return this._router
  }

  private initRoutes() {
    this._router.get(
      '/',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('userInvitation', 'read'),
      this.controller.readUserInvitations
    )
  }
}
