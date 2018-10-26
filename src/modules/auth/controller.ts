import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'

import { User } from '../user/model'
import { UserRole } from '../user/userRole/model'
import { UserInvitation } from '../user/userInvitation/model'

import { AuthService } from '../../services/auth'
import { AuthMailService } from './services/mail'
import { HelperService } from '../../services/helper'

export class AuthController {
  private readonly userRepo: Repository<User> = getManager().getRepository('User')
  private readonly userRoleRepo: Repository<UserRole> = getManager().getRepository('UserRole')
  private readonly userInvRepo: Repository<UserInvitation> = getManager().getRepository(
    'UserInvitation'
  )

  private readonly authService: AuthService = new AuthService()
  private readonly authMailService: AuthMailService = new AuthMailService()
  private readonly helperService: HelperService = new HelperService()

  @bind
  public async signinUser(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user: User = await this.userRepo.findOne({
        select: ['id', 'email', 'firstname', 'lastname', 'password'],
        where: {
          email: req.body.user.email,
          active: true
        },
        relations: ['userRole']
      })

      // wrong email or password
      if (
        !user ||
        !(await this.helperService.verifyPassword(req.body.user.password, user.password))
      ) {
        return res.status(401).json({ status: 401, error: 'wrong email or password' })
      }

      // create jwt -> required for further requests
      const token: string = this.authService.createToken(user.id)

      // don't send user password in response
      delete user.password

      return res.json({
        status: res.statusCode,
        data: {
          user: user,
          token: token
        }
      })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async validateHash(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const invitation = await this.getUserInvitation(req.params.hash)
      return invitation && invitation.id
        ? res.status(204).send()
        : res.status(403).json({
            status: 403,
            error: 'invalid hash'
          })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async registerUser(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user: User = await this.userRepo.findOne({
        where: {
          email: req.body.user.email
        }
      })

      // email is already taken
      if (user && user.id) {
        return res.status(400).json({ status: 400, error: 'email is already taken' })
      }

      const invitation: UserInvitation = await this.getUserInvitation(
        req.params.hash,
        req.body.user.email
      )

      // invalid registration hash
      if (!invitation) {
        return res.status(403).json({ status: 403, error: 'invalid hash' })
      }

      const newUser: User = await this.userRepo.save({
        ...req.body.user,
        password: await this.helperService.hashPassword(req.body.user.password),
        userRole: {
          id: 1,
          name: 'User'
        }
      })

      // don't send user password in response
      delete newUser.password

      // remove user invitation
      await this.userInvRepo.remove(invitation)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async createUserInvitation(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const uuid = this.helperService.generateUuid()

      const invitation = await this.userInvRepo.save({
        email: req.body.email,
        hash: uuid
      })

      await this.authMailService.sendUserInvitation(req.body.email, req.body.name, uuid)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async unregisterUser(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user: User = await this.userRepo.findOne({
        where: {
          email: req.user.email,
          active: true
        }
      })

      // user not found
      if (!user) {
        return res.status(404).json({ status: 404, error: 'user not found' })
      }

      await this.userRepo.remove(user)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }

  @bind
  private async getUserInvitation(hash: string, email?): Promise<UserInvitation> {
    try {
      return email === undefined
        ? this.userInvRepo.findOne({ where: { hash: hash } })
        : this.userInvRepo.findOne({
            where: {
              hash: hash,
              email: email
            }
          })
    } catch (err) {
      throw err
    }
  }
}
