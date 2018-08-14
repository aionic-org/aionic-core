import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'

import { User } from '../../user/models/user.model'
import { UserRole } from '../../user/models/userRole.model'

import { AuthService } from '../../../services/auth.service'
import { AuthMailService } from '../services/auth.mail.service'
import { HelperService } from '../../../services/helper.service'

export class AuthController {
  private readonly userRepo: Repository<User> = getManager().getRepository('User')
  private readonly userRoleRepo: Repository<UserRole> = getManager().getRepository('UserRole')

  private readonly authService: AuthService = new AuthService()
  private readonly authMailService: AuthMailService = new AuthMailService()
  private readonly helperService: HelperService = new HelperService()

  @bind
  public async signin(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user: User = await this.userRepo.findOne({
        select: ['id', 'password'],
        where: {
          email: req.body.email,
          active: true
        },
        relations: ['userRole']
      })

      // wrong email or password
      if (!user || !user.id) {
        return res.status(401).json({
          status: 401,
          error: 'wrong email or password'
        })
      }

      if (!(await this.helperService.verifyPassword(req.body.password, user.password))) {
        return res.status(401).json({
          status: 401,
          error: 'wrong email or password'
        })
      }

      // create jwt -> required for further requests
      const token: string = this.authService.createToken(user.id)

      return res.json({
        status: res.statusCode,
        data: {
          userID: user.id,
          userRole: user.userRole.name,
          token: token
        }
      })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async register(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user: User = await this.userRepo.findOne({
        where: {
          email: req.body.email
        }
      })

      // email is already taken
      if (user && user.id) {
        return res.status(400).json({
          status: 400,
          error: 'email is already taken'
        })
      }

      // hash for account activation url
      const uuidHash = this.helperService.createUuidHash()

      const newUser: User = this.userRepo.create({
        email: req.body.email,
        password: await this.helperService.hashPassword(req.body.password),
        registerHash: uuidHash,
        userRole: await this.userRoleRepo.findOne({
          where: {
            name: 'User'
          }
        })
      })

      await this.userRepo.save(newUser)

      // send mail for registration
      await this.authMailService.sendRegisterMail(newUser, uuidHash)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async registerActivate(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user: User = await this.userRepo.findOne({
        where: {
          registerHash: req.params.uuidHash,
          active: false
        }
      })

      // user not found
      if (!user || !user.id) {
        return res.status(404).json({ status: 404, error: 'user not found' })
      }

      // set user active
      user.active = true
      user.registerHash = null

      await this.userRepo.save(user)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async registerResend(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user: User = await this.userRepo.findOne({
        where: {
          email: req.params.email,
          active: false
        }
      })

      // user not found
      if (!user || !user.id) {
        return res.status(404).json({ status: 404, error: 'user not found' })
      }

      // set new hash for registration
      const uuidHash = this.helperService.createUuidHash()
      user.registerHash = uuidHash

      await this.userRepo.save(user)

      // resend mail for registration
      await this.authMailService.sendRegisterMail(user, uuidHash)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async unregister(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user: User = await this.userRepo.findOne({
        where: {
          email: req.user.email,
          active: true
        }
      })

      // user not found
      if (!user || !user.id) {
        return res.status(404).json({ status: 404, error: 'user not found' })
      }

      await this.userRepo.delete(user.id)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }
}
