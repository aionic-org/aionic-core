import { Router } from 'express';

import { IComponentRoutes } from '../../../../index';

import { AuthService, PassportStrategy } from '@services/auth';

import { ProjectShareController } from './controller';

export class ProjectShareRoutes implements IComponentRoutes<ProjectShareController> {
	readonly controller: ProjectShareController = new ProjectShareController();
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
			this.authSerivce.hasPermission('project', 'share'),
			this.controller.shareProject
		);
	}
}
