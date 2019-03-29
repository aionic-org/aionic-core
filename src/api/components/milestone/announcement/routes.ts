import { Router } from 'express'

import { AuthService, PassportStrategy } from '@services/auth'

import { AnnouncementController } from './controller'

export class AnnouncementRoutes {
  private readonly controller: AnnouncementController = new AnnouncementController()
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
      this.authSerivce.hasPermission('announcement', 'read'),
      this.controller.readAnnouncements
    )

    this.router.get(
      '/:announcementId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('announcement', 'read'),
      this.controller.readAnnouncement
    )

    this.router.post(
      '/',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('announcement', 'create'),
      this.controller.createAnnouncement
    )

    this.router.delete(
      '/:announcementId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('announcement', 'delete'),
      this.controller.deleteAnnouncement
    )
  }
}
