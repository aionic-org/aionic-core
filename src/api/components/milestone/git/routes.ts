import { Router } from 'express';

import { AuthService, PassportStrategy } from '@services/auth';

import { GitOranizationRoutes } from './_child/organization/routes';
import { GitRepositoryRoutes } from './_child/repository/routes';

export class GitRoutes {
	private authSerivce: AuthService;
	private _router: Router = Router();

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);

		this.initChildRoutes(defaultStrategy);
	}

	public get router(): Router {
		return this._router;
	}

	private initChildRoutes(defaultStrategy?: PassportStrategy): void {
		this.router.use('/', new GitOranizationRoutes(defaultStrategy).router);
		this.router.use('/:orgId', new GitRepositoryRoutes(defaultStrategy).router);
	}
}
