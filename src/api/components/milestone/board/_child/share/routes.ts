import { Router } from 'express';

import { IComponentRoutes } from '../../../../index';

import { AuthService, PassportStrategy } from '@services/auth';

import { BoardShareController } from './controller';

export class BoardShareRoutes implements IComponentRoutes<BoardShareController> {
	readonly controller: BoardShareController = new BoardShareController();
	readonly router: Router = Router({ mergeParams: true });
	authSerivce: AuthService;

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	initRoutes(): void {
		this.router.post(
			'/share',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('board', 'share'),
			this.controller.shareBoard
		);
	}
}
