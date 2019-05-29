import { Router } from 'express'

import { AuthService, PassportStrategy } from '@services/auth'

import { BoardController } from './controller'

export class BoardRoutes {
  private readonly controller: BoardController = new BoardController()
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
      this.authSerivce.hasPermission('board', 'read'),
      this.controller.readBoards
    )

    this.router.get(
      '/:boardId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('board', 'read'),
      this.controller.readBoard
    )

    this.router.post(
      '/',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('board', 'create'),
      this.controller.createBoard
    )

    this.router.put(
      '/:boardId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('board', 'update'),
      this.controller.updateBoard
    )

    this.router.delete(
      '/:boardId',
      this.authSerivce.isAuthorized(),
      this.authSerivce.hasPermission('board', 'delete'),
      this.controller.deleteBoard
    )
  }
}
