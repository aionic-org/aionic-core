import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'

import { User } from '../models/user.model'

export class UserController {
  private readonly userRepo: Repository<User> = getManager().getRepository('User')

  @bind
  public async readUsers(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const users: Array<User> = await this.userRepo.find()

      return res.json({ status: res.statusCode, data: users })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async readUser(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user: User = await this.userRepo.findOne(req.params.id)

      return res.json({ status: res.statusCode, data: user })
    } catch (err) {
      return next(err)
    }
  }
}
