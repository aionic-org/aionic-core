import { Router } from 'express';

import { IComponentRoutes } from '../../../../index';

import { AuthService, PassportStrategy } from '@services/auth';

import { ProjectCommentController } from './controller';

export class ProjectCommentRoutes implements IComponentRoutes<ProjectCommentController> {
	readonly controller: ProjectCommentController = new ProjectCommentController();
	readonly router: Router = Router({ mergeParams: true });
	authSerivce: AuthService;

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	initRoutes(): void {
		this.router.get(
			'/comments',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('projectComment', 'read'),
			this.controller.readProjectComments
		);

		this.router.post(
			'/comments',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('projectComment', 'create'),
			this.controller.createProjectComment
		);

		this.router.delete(
			'/comments/:commentID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('projectComment', 'delete'),
			this.controller.deleteProjectComment
		);
	}
}
