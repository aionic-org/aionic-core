import { Router } from 'express';

import { IComponentRoutes } from '../../../../index';

import { AuthService, PassportStrategy } from '@services/auth';

import { GitRepositoryController } from './controller';

export class GitRepositoryRoutes implements IComponentRoutes<GitRepositoryController> {
	readonly controller: GitRepositoryController = new GitRepositoryController();
	readonly router: Router = Router({ mergeParams: true });
	authSerivce: AuthService;

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);

		this.initRoutes();
	}

	initRoutes(): void {
		this.router.get(
			'/repository',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('gitOrgRepo', 'read'),
			this.controller.readGitOrgRepos
		);

		this.router.get(
			'/repository/:repoID/:branch/commits',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('gitOrgRepo', 'read'),
			this.controller.readGitOrgRepoCommits
		);
	}
}
