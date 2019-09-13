import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { UserRoleService } from './service';
import { UserRole } from './model';

export class UserRoleController {
	private readonly service: UserRoleService = new UserRoleService();

	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async readUserRoles(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const userRoles: UserRole[] = await this.service.readUserRoles({}, true);

			return res.json({ status: res.statusCode, data: userRoles });
		} catch (err) {
			return next(err);
		}
	}
}
