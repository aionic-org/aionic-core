import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { UtilityService } from '@services/helper/utility';

import { UserService } from './service';
import { User } from './model';

export class UserController {
	private readonly userService: UserService = new UserService();

	/**
	 * Read users
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readUsers(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const users: User[] = await this.userService.readUsers({}, true);

			return res.json({ status: res.statusCode, data: users });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Read users by username
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readUsersByUsername(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { username } = req.query;

			const users: User[] = await this.userService.readUsersByUsername(username);

			return res.json({ status: res.statusCode, data: users });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Read user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { userID } = req.params;

			if (!userID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const user: User | undefined = await this.userService.readUser({
				where: {
					id: parseInt(userID, 10)
				}
			});

			return res.json({ status: res.statusCode, data: user });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Create user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async createUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { user } = req.body;

			if (!user) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const existingUser: User | undefined = await this.userService.readUser({
				where: {
					email: user.email
				}
			});

			// Email is already taken
			if (existingUser) {
				return res.status(400).json({ status: 400, error: 'Email is already taken' });
			}

			const newUser: User = await this.userService.saveUser({
				...user,
				password: await UtilityService.hashPassword(user.password)
			});

			return res.json({ status: res.statusCode, data: newUser });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Update user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async updateUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { userID } = req.params;

			if (!userID || !req.body.user) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const user: User | undefined = await this.userService.readUser({
				where: {
					id: parseInt(userID, 10)
				}
			});

			if (!user) {
				return res.status(404).json({ status: 404, error: 'User not found' });
			}

			const updatedUser: User = await this.userService.saveUser(req.body.user);

			return res.json({ status: res.statusCode, data: updatedUser });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Delete user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { userID } = req.params;

			if (!userID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const user: User | undefined = await this.userService.readUser({
				where: {
					id: parseInt(userID, 10)
				}
			});

			if (!user) {
				return res.status(404).json({ status: 404, error: 'User not found' });
			}

			await this.userService.deleteUser(user);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
