import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'

import { CacheService } from '../../../services/cache'

import { UserRole } from './model'

export class UserRoleController {
  private readonly cacheService: CacheService = new CacheService()
  private readonly userRoleRepo: Repository<UserRole> = getManager().getRepository('User')

  @bind
  public async readUserRoles(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const userRoles: Array<UserRole> = await this.cacheService.get('userRole', this)

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
  private getCachedContent(): Promise<Array<UserRole>> {
    return this.userRoleRepo.find()
  }
}
