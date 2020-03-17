import { Router } from 'express';

import { AuthService, PassportStrategy } from '@services/auth';

import { IComponentRoutes } from '../../index';

import { BoardController } from './controller';
import { BoardShareRoutes } from './_child/share/routes';
import { BoardTaskRoutes } from './_child/tasks/routes';

export class BoardRoutes implements IComponentRoutes<BoardController> {
	readonly controller: BoardController = new BoardController();
	readonly authSerivce: AuthService;
	_router: Router = Router();

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);

		this.initRoutes();
		this.initChildRoutes(defaultStrategy);
	}

	public get router(): Router {
		return this._router;
	}

	initRoutes(): void {
		this.router.get(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('board', 'read'),
			this.controller.readBoards
		);

		this.router.get(
			'/:boardID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('board', 'read'),
			this.controller.readBoard
		);

		this.router.post(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('board', 'create'),
			this.controller.createBoard
		);

		this.router.put(
			'/:boardID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('board', 'update'),
			this.controller.updateBoard
		);

		this.router.delete(
			'/:boardID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('board', 'delete'),
			this.controller.deleteBoard
		);
	}

	initChildRoutes(defaultStrategy?: PassportStrategy): void {
		this.router.use('/:boardID', new BoardShareRoutes(defaultStrategy).router);
		this.router.use('/:boardID', new BoardTaskRoutes(defaultStrategy).router);
	}
}
