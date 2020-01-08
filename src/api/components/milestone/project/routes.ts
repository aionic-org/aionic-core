import { Router } from 'express';

import { IComponentRoutes } from '../../index';

import { AuthService, PassportStrategy } from '@services/auth';

import { ProjectCommentRoutes } from './_child/comment/routes';
import { ProjectController } from './controller';
import { ProjectShareRoutes } from './_child/share/routes';

export class ProjectRoutes implements IComponentRoutes<ProjectController> {
	readonly controller: ProjectController = new ProjectController();
	readonly router: Router = Router();
	authSerivce: AuthService;

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);

		this.initRoutes();
		this.initChildRoutes(defaultStrategy);
	}

	initRoutes(): void {
		this.router.get(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('project', 'read'),
			this.controller.readProjects
		);

		this.router.get(
			'/:projectID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('project', 'read'),
			this.controller.readProject
		);

		this.router.post(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('project', 'create'),
			this.controller.createProject
		);

		this.router.put(
			'/:projectID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('project', 'update'),
			this.controller.updateProject
		);

		this.router.delete(
			'/:projectID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('project', 'delete'),
			this.controller.deleteProject
		);
	}

	initChildRoutes(defaultStrategy?: PassportStrategy): void {
		this.router.use('/:projectID', new ProjectCommentRoutes(defaultStrategy).router);
		this.router.use('/:projectID', new ProjectShareRoutes(defaultStrategy).router);
	}
}
