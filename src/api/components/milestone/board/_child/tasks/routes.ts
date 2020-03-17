import { Router } from 'express';

import { AuthService, PassportStrategy } from '@services/auth';

import { IComponentRoutes } from '../../../../index';

import { BoardTasksController } from './controller';

export class BoardTaskRoutes implements IComponentRoutes<BoardTasksController> {
	readonly controller: BoardTasksController = new BoardTasksController();
	authSerivce: AuthService;
	readonly router: Router = Router({ mergeParams: true });

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);

		this.initRoutes();
	}

	initRoutes(): void {
		this.router.get(
			'/tasks',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('board-tasks', 'read'),
			this.controller.readBoardTasks
		);
	}
}
