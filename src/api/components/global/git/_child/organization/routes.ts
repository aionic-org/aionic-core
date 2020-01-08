import { Router } from 'express';

import { IComponentRoutes } from '../../../../index';

import { AuthService, PassportStrategy } from '@services/auth';

import { GitOrganizationController } from './controller';

import { GitRepositoryRoutes } from '../repository/routes';

export class GitOranizationRoutes implements IComponentRoutes<GitOrganizationController> {
	readonly controller: GitOrganizationController = new GitOrganizationController();
	readonly router: Router = Router();
	authSerivce: AuthService;

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);

		this.initRoutes();
		this.initChildRoutes(defaultStrategy);
	}

	initRoutes(): void {
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
			'/organization/:orgID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('gitOrgs', 'update'),
			this.controller.updateGitOrg
		);

		this.router.delete(
			'/organization/:orgID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('gitOrgs', 'delete'),
			this.controller.deleteGitOrg
		);
	}

	initChildRoutes(defaultStrategy?: PassportStrategy): void {
		this.router.use('/:orgID', new GitRepositoryRoutes(defaultStrategy).router);
	}
}
