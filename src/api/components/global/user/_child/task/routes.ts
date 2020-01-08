import { Router } from 'express';

import { IComponentRoutes } from '../../../../index';

import { AuthService, PassportStrategy } from '@services/auth';

import { UserTaskController } from './controller';

export class UserTaskRoutes implements IComponentRoutes<UserTaskController> {
	readonly controller: UserTaskController = new UserTaskController();
	readonly router: Router = Router({ mergeParams: true });
	authSerivce: AuthService;

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	initRoutes(): void {
		this.router.get(
			'/tasks',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('userTask', 'read'),
			this.controller.readUserTasks
		);
	}
}
