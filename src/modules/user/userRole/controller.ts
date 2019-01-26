import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { getManager, Repository } from 'typeorm'

import { CacheService } from '../../../services/cache'

import { UserRole } from './model'

export class UserRoleController {
  private readonly cacheService: CacheService = new CacheService()
  private readonly userRoleRepo: Repository<UserRole> = getManager().getRepository('User')

  @bind
  public async readUserRoles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const userRoles: UserRole[] = await this.cacheService.get('userRole', this)

      return res.json({ status: res.statusCode, data: userRoles })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * get target content for cache service
   *
   * @returns {Promise<Array<UserRole>>}
   */
  @bind
  private getCachedContent(): Promise<UserRole[]> {
    return this.userRoleRepo.find()
  }
}
