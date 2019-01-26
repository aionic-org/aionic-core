import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { getManager, Repository } from 'typeorm'

import { CacheService } from '../../services/cache'

import { User } from './model'

export class UserController {
  private readonly cacheService: CacheService = new CacheService()
  private readonly userRepo: Repository<User> = getManager().getRepository('User')

  @bind
  public async readUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const users: User[] = await this.cacheService.get('user', this)

      return res.json({ status: res.statusCode, data: users })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async readUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const user: User | undefined = await this.userRepo.findOne(req.params.id)

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
  private getCachedContent(): Promise<User[]> {
    return this.userRepo.find({
      relations: ['userRole']
    })
  }
}
