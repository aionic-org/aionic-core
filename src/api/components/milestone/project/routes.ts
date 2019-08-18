import { Router } from 'express';

import { AuthService, PassportStrategy } from '@services/auth';

import { ProjectCommentRoutes } from './_child/comment/routes';
import { ProjectController } from './controller';
import { ProjectShareRoutes } from './_child/share/routes';

export class ProjectRoutes {
	private readonly controller: ProjectController = new ProjectController();
	private authSerivce: AuthService;
	private _router: Router = Router();

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);

		this.initRoutes();
		this.initChildRoutes(defaultStrategy);
	}

	public get router(): Router {
		return this._router;
	}

	private initRoutes(): void {
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

	private initChildRoutes(defaultStrategy?: PassportStrategy): void {
		this.router.use('/:projectID', new ProjectCommentRoutes(defaultStrategy).router);
		this.router.use('/:projectID', new ProjectShareRoutes(defaultStrategy).router);
	}
}
