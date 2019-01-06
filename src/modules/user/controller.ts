import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'

import { CacheService } from '../../services/cache'

import { User } from './model'

export class UserController {
  private readonly cacheService: CacheService = new CacheService()
  private readonly userRepo: Repository<User> = getManager().getRepository('User')

  @bind
  public async readUsers(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const users: Array<User> = await this.cacheService.get('user', this)

      return res.json({ status: res.statusCode, data: users })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async readUser(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user: User = await this.userRepo.findOne(req.params.id)

      const statusCode = user && user.id ? res.statusCode : 404

      return res.status(statusCode).json({ status: statusCode, data: user })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * get target content for cache service
   *
   * @returns {Promise<Array<User>>}
   */
  @bind
  private getCachedContent(): Promise<Array<User>> {
    return this.userRepo.find()
  }
}
