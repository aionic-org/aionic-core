import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { getManager, Repository } from 'typeorm'

import { AuthService } from '../../services/auth'
import { CacheService } from '../../services/cache'
import { HelperService } from '../../services/helper'
import { AuthMailService } from './services/mail'

import { User } from '../user/model'
import { UserInvitation } from '../user/userInvitation/model'

export class AuthController {
  private readonly authService: AuthService = new AuthService()
  private readonly authMailService: AuthMailService = new AuthMailService()
  private readonly helperService: HelperService = new HelperService()
  private readonly cacheService: CacheService = new CacheService()

  private readonly userRepo: Repository<User> = getManager().getRepository('User')
  private readonly userInvRepo: Repository<UserInvitation> = getManager().getRepository(
    'UserInvitation'
  )

  @bind
  public async signinUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user: User | undefined = await this.userRepo.findOne({
        relations: ['userRole'],
        select: ['id', 'email', 'firstname', 'lastname', 'password'],
        where: {
          active: true,
          email: req.body.user.email
        }
      })

      // Wrong email or password
      if (
        !user ||
        !(await this.helperService.verifyPassword(req.body.user.password, user.password))
      ) {
        return res.status(401).json({ status: 401, error: 'wrong email or password' })
      }

      // Create jwt -> required for further requests
      const token: string = this.authService.createToken(user.id)

      // Don't send user password in response
      delete user.password

      return res.json({ status: res.statusCode, data: { user, token } })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async validateHash(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const invitation = await this.getUserInvitation(req.params.hash)
      return invitation && invitation.id
        ? res.status(204).send()
        : res.status(403).json({ status: 403, error: 'invalid hash' })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user: User | undefined = await this.userRepo.findOne({
        where: {
          email: req.body.user.email
        }
      })

      // Email is already taken
      if (user) {
        return res.status(400).json({ status: 400, error: 'email is already taken' })
      }

      const invitation: UserInvitation | undefined = await this.getUserInvitation(
        req.params.hash,
        req.body.user.email
      )

      // Invalid registration hash
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

      // Clear user cache
      this.cacheService.delete('user')

      // Don't send user password in response
      delete newUser.password

      // Remove user invitation
      await this.userInvRepo.remove(invitation)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async createUserInvitation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const uuid = this.helperService.generateUuid()

      await this.userInvRepo.save({
        email: req.body.email,
        hash: uuid
      })

      await this.authMailService.sendUserInvitation(req.body.email, uuid)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async unregisterUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const user: User | undefined = await this.userRepo.findOne({
        where: {
          active: true,
          email: req.user.email
        }
      })

      // User not found
      if (!user) {
        return res.status(404).json({ status: 404, error: 'user not found' })
      }

      await this.userRepo.remove(user)

      // Clear user cache
      this.cacheService.delete('user')

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }

  @bind
  private async getUserInvitation(
    hash: string,
    email?: string
  ): Promise<UserInvitation | undefined> {
    try {
      return email === undefined
        ? this.userInvRepo.findOne({
            where: { hash }
          })
        : this.userInvRepo.findOne({ where: { hash, email } })
    } catch (err) {
      throw err
    }
  }
}
