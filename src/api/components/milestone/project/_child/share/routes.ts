import { Router } from 'express';

import { AuthService, PassportStrategy } from '@services/auth';

import { ProjectShareController } from './controller';

export class ProjectShareRoutes {
	protected readonly controller: ProjectShareController = new ProjectShareController();
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
			this.authSerivce.hasPermission('project', 'share'),
			this.controller.shareProject
		);
	}
}
