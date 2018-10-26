import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'

import { UserInvitation } from './model'

export class UserInvitationController {
  private readonly userInvitationRepo: Repository<UserInvitation> = getManager().getRepository(
    'UserInvitation'
  )

  @bind
  public async readUserInvitations(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userInvitations: Array<UserInvitation> = await this.userInvitationRepo.find()

      return res.json({ status: res.statusCode, data: userInvitations })
    } catch (err) {
      return next(err)
    }
  }
}
