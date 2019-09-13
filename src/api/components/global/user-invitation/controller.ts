import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { UserInvitation } from './model';
import { UserInvitationService } from './service';

export class UserInvitationController {
	private readonly service: UserInvitationService = new UserInvitationService();

	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async readUserInvitations(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const userInvitations: UserInvitation[] = await this.service.readUserInvitations();

			return res.json({ status: res.statusCode, data: userInvitations });
		} catch (err) {
			return next(err);
		}
	}
}
