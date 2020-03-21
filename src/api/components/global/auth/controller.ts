import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { parse, stringify } from 'querystring';
import validator from 'validator';

import { env, ApplicationSymbols } from '@config/globals';

import { AuthService } from '@services/auth';
import { NodeCacheService } from '@services/cache/node-cache';
import { HttpService } from '@services/helper/http';
import { UtilityService } from '@services/helper/utility';

import { User } from '@global/user/model';
import { UserService } from '@global/user/service';
import { UserRoleService } from '@global/user-role/service';
import { UserInvitation } from '@global/user-invitation/model';
import { UserInvitationService } from '@global/user-invitation/service';

import { TaskStatusService } from '@milestone/task-status/service';
import { TaskPriorityService } from '@milestone/task-priority/service';

import { AuthMailService } from './services/mail';

export class AuthController {
	private readonly authService: AuthService = new AuthService();
	private readonly authMailService: AuthMailService = new AuthMailService();
	private readonly cacheService: NodeCacheService = new NodeCacheService();
	private readonly httpService: HttpService = new HttpService();

	private readonly userService: UserService = new UserService();
	private readonly userRoleService: UserRoleService = new UserRoleService();
	private readonly userInvService: UserInvitationService = new UserInvitationService();

	/**
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async signinUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { email, password } = req.body;

			if (!email || !password) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const user: User | undefined = await this.userService.readSigninUser(req.client, email);

			// Wrong email or password
			if (!user || !(await UtilityService.verifyPassword(password, user.password))) {
				return res.status(401).json({ status: 401, error: 'Wrong email or password' });
			}

			// Create jwt -> required for further requests
			const token: string = this.authService.createToken(user.id);

			// Don't send user password in response
			delete user.password;

			// Get config for client application
			const config: object = await this.getClientConfig(req.client);

			return res.json({ status: res.statusCode, data: { config, token, user } });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Register new user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async registerUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { hash } = req.params;
			const { email, password } = req.body.user;

			if (!email || !req.body.user) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const invitation: UserInvitation | undefined = await this.userInvService.readUserInvitation({ hash, email });

			// Invalid registration hash
			if (!invitation) {
				return res.status(403).json({ status: 403, error: 'Invalid hash' });
			}

			const user: User | undefined = await this.userService.read({
				where: {
					email
				}
			});

			// Email is already taken
			if (user) {
				return res.status(400).json({ status: 400, error: 'Email is already taken' });
			}

			const newUser: User = await this.userService.save({
				...req.body.user,
				password: await UtilityService.hashPassword(password),
				userRole: await this.userRoleService.readUserUserRole()
			});

			// Clear user cache
			this.cacheService.delete('users');

			// Don't send user password in response
			delete newUser.password;

			// Remove user invitation
			await this.userInvService.deleteUserInvitation(invitation);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Create user invitation that is required for registration
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async generateUserInvitation(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { email } = req.body;

			if (!email || !validator.isEmail(email)) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const user: User | undefined = await this.userService.read({
				where: {
					email
				}
			});

			// User is already registered
			if (user) {
				return res.status(400).json({ status: 400, error: 'Email is already taken' });
			}

			// UUID for registration link
			const hash = UtilityService.generateUuid();

			// Create user invitation
			const invitation = new UserInvitation();
			invitation.email = email;
			invitation.hash = hash;

			// Save and send invitation mail
			await this.userInvService.saveUserInvitation(invitation);
			await this.authMailService.sendUserInvitation(req.body.email, hash);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Unregister user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async unregisterUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { email } = req.user as User;

			if (!email) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const user: User | undefined = await this.userService.read({
				where: {
					email
				}
			});

			// User not found
			if (!user) {
				return res.status(404).json({ status: 404, error: 'User not found' });
			}

			await this.userService.delete(user);

			// Clear user cache
			this.cacheService.delete('users');

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async handleGitHubAuth(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const url = `https://github.com/login/oauth/authorize?${stringify({
				client_id: env.GITHUB.id as string,
				scope: 'user:email'
			})}`;

			return res.json({
				data: url,
				status: res.statusCode
			});
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async handleGitHubAuthCallback(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { code } = req.query;

			const result = await this.httpService.request({
				method: 'post',
				params: {
					code,
					accept: 'json',
					client_id: env.GITHUB.id,
					client_secret: env.GITHUB.secret
				},
				url: `https://github.com/login/oauth/access_token`
			});

			const access_token = parse(result.data).access_token;

			/*const user = await this.httpService.fetchData('https://api.github.com/user', {
        access_token
      })*/

			return res.send(access_token);
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Get config data for given app client
	 *
	 * @param client Client application
	 * @returns Returns config object for client
	 */
	@bind
	private async getClientConfig(client: ApplicationSymbols): Promise<object> {
		try {
			let config: object = {};

			switch (client) {
				case ApplicationSymbols.milestone:
					config = {
						taskStatus: await new TaskStatusService().readAll(),
						taskPriorities: await new TaskPriorityService().readTaskPriorities()
					};
					break;
			}

			return config;
		} catch (err) {
			throw err;
		}
	}
}
