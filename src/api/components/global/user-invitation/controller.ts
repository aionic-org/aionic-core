import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { getManager, Repository } from 'typeorm';

import { UserInvitation } from './model';

export class UserInvitationController {
  private readonly userInvitationRepo: Repository<UserInvitation> = getManager().getRepository(
    'UserInvitation'
  );

  /**
   * Read user invitations from db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async readUserInvitations(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userInvitations: UserInvitation[] = await this.userInvitationRepo.find();

      return res.json({ status: res.statusCode, data: userInvitations });
    } catch (err) {
      return next(err);
    }
  }
}
