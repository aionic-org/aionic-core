import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'

import { UserRole } from './model'

export class UserRoleController {
  private readonly userRoleRepo: Repository<UserRole> = getManager().getRepository('User')

  @bind
  public async readUserRoles(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userRoles: Array<UserRole> = await this.userRoleRepo.find()

      return res.json({ status: res.statusCode, data: userRoles })
    } catch (err) {
      return next(err)
    }
  }
}
