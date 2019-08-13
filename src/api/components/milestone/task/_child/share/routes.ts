import { Router } from 'express';

import { AuthService, PassportStrategy } from '@services/auth';

import { TaskShareController } from './controller';

export class TaskShareRoutes {
	protected readonly controller: TaskShareController = new TaskShareController();
	protected authSerivce: AuthService;
	private _router: Router = Router({ mergeParams: true });

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	public get router(): Router {
		return this._router;
	}

	private initRoutes(): void {
		this.router.get(
			'/share',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('task', 'share'),
			this.controller.shareTask
		);
	}
}
