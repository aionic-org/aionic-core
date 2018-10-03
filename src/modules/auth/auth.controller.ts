import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'

import { User } from '../user/user.model'
import { UserRole } from '../user/userRole/userRole.model'
import { UserInvitation } from '../user/userInvitation/userInvitation.model'

import { AuthService } from '../../services/auth.service'
import { AuthMailService } from './services/auth.mail.service'
import { HelperService } from '../../services/helper.service'

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
  public async signin(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user: User = await this.userRepo.findOne({
        select: ['id', 'email', 'firstname', 'lastname', 'password'],
        where: {
          email: req.body.email,
          active: true
        },
        relations: ['userRole']
      })

      // wrong email or password
      if (!user || !(await this.helperService.verifyPassword(req.body.password, user.password))) {
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
  public async register(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const user: User = await this.userRepo.findOne({
        where: {
          email: req.body.email
        }
      })

      // email is already taken
      if (user && user.id) {
        return res.status(400).json({ status: 400, error: 'email is already taken' })
      }

      const invitation: UserInvitation = await this.getUserInvitation(
        req.params.hash,
        req.body.email
      )

      // invalid registration hash
      if (!invitation) {
        return res.status(400).json({ status: 403, error: 'invalid hash' })
      }

      await this.userRepo.save({
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: await this.helperService.hashPassword(req.body.password),
        active: true,
        userRole: {
          id: 1,
          name: 'User'
        }
      })

      // remove user invitation
      await this.userInvRepo.remove(invitation)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async createInvitation(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      await this.userInvRepo.save({
        email: req.body.email,
        hash: this.helperService.generateUuid()
      })

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
      if (email !== undefined) {
        return this.userInvRepo.findOne({
          where: {
            hash: hash,
            email: email
          }
        })
      } else {
        return this.userInvRepo.findOne({ where: { hash: hash } })
      }
    } catch (err) {
      throw err
    }
  }
}
