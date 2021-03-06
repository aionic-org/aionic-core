import { Router } from 'express';

import { IComponentRoutes } from '../../index';

import { AuthService, PassportStrategy } from '@services/auth';

import { AuthController } from './controller';

export class AuthRoutes implements IComponentRoutes<AuthController> {
	readonly controller: AuthController = new AuthController();
	readonly router: Router = Router();
	authSerivce: AuthService;

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	initRoutes(): void {
		this.router.post('/signin', this.controller.signinUser);
		this.router.get('/register/:hash', this.controller.validateRegistrationHash);
		this.router.post('/register/:hash', this.controller.registerUser);
		this.router.post('/invitation', this.controller.createUserInvitation);
		this.router.get('/github', this.controller.handleGitHubAuth);
		this.router.get('/github/cb', this.controller.handleGitHubAuthCallback);
		this.router.post('/unregister', this.authSerivce.isAuthorized(), this.controller.unregisterUser);
	}
}
