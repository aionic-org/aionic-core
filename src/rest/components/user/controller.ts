import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { getManager, Repository } from 'typeorm'

import { CacheService } from '@services/cache'

import { User } from './model'

export class UserController {
  private readonly cacheService: CacheService = new CacheService()
  private readonly userRepo: Repository<User> = getManager().getRepository('User')

  /**
   * Read all users from db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
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

  /**
   * Read a certain user from db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async readUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const { userId } = req.params

      if (!userId) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const user: User | undefined = await this.userRepo.findOne(userId, {
        relations: ['userRole', 'assignee']
      })

      return res.json({ status: res.statusCode, data: user })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Get target content for cache service
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
