import { Router } from 'express';

import { IComponentRoutes } from '../../../../index';

import { AuthService, PassportStrategy } from '@services/auth';

import { ScratchpadController } from './controller';

export class TaskScratchpadRoutes implements IComponentRoutes<ScratchpadController> {
	readonly controller: ScratchpadController = new ScratchpadController();
	readonly router: Router = Router({ mergeParams: true });
	authSerivce: AuthService;

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	initRoutes(): void {
		this.router.get(
			'/scratchpads/users/:userID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('taskScratchpad', 'read'),
			this.controller.readTaskScratchpadByUser
		);
		this.router.post(
			'/scratchpads/users/:userID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('taskScratchpad', 'create'),
			this.controller.saveTaskScratchpad
		);
	}
}
