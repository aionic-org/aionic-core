import { Router } from 'express';

import { AuthService, PassportStrategy } from '@services/auth';

import { GitOrganizationController } from './controller';

import { GitRepositoryRoutes } from '../repository/routes';

export class GitOranizationRoutes {
	private readonly controller: GitOrganizationController = new GitOrganizationController();
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
			'/organization',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('gitOrgs', 'read'),
			this.controller.readGitOrgs
		);

		this.router.post(
			'/organization',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('gitOrgs', 'create'),
			this.controller.createGitOrg
		);

		this.router.put(
			'/organization/:orgId',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('gitOrgs', 'update'),
			this.controller.updateGitOrg
		);

		this.router.delete(
			'/organization/:orgId',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('gitOrgs', 'delete'),
			this.controller.deleteGitOrg
		);
	}

	private initChildRoutes(defaultStrategy?: PassportStrategy): void {
		this.router.use('/:orgId', new GitRepositoryRoutes(defaultStrategy).router);
	}
}
