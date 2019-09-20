import { Router } from 'express';

import { AuthService, PassportStrategy } from '@services/auth';

import { UserController } from './controller';

import { UserTaskRoutes } from './_child/task/routes';

export class UserRoutes {
	private authSerivce: AuthService;
	private readonly _router: Router = Router();
	private readonly controller: UserController = new UserController();

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);

		this.initChildRoutes(defaultStrategy);
		this.initRoutes();
	}

	public get router(): Router {
		return this._router;
	}

	private initRoutes() {
		this._router.get(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('user', 'read'),
			this.controller.readUsers
		);

		this._router.get(
			'/search',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('user', 'read'),
			this.controller.readUsersByUsername
		);

		this._router.post(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('user', 'create'),
			this.controller.createUser
		);

		this._router.get(
			'/:userID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('user', 'read'),
			this.controller.readUser
		);

		this._router.put(
			'/:userID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('user', 'update'),
			this.controller.updateUser
		);

		this._router.delete(
			'/:userID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('user', 'delete'),
			this.controller.deleteUser
		);
	}

	private initChildRoutes(defaultStrategy?: PassportStrategy): void {
		this.router.use('/:userID', new UserTaskRoutes(defaultStrategy).router);
	}
}
