import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { getManager, Repository } from 'typeorm'

import { AuthService } from '@services/auth'
import { CacheService } from '@services/cache'
import { UtilityService } from '@services/helper/utility'

import { AuthMailService } from './services/mail'

import { UserInvitation } from '@components/user/invitation/model'
import { User } from '@components/user/model'

export class AuthController {
  private readonly authService: AuthService = new AuthService()
  private readonly authMailService: AuthMailService = new AuthMailService()
  private readonly cacheService: CacheService = new CacheService()

  private readonly userRepo: Repository<User> = getManager().getRepository('User')
  private readonly userInvRepo: Repository<UserInvitation> = getManager().getRepository(
    'UserInvitation'
  )

  /**
   * Signin user
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async signinUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { email, password } = req.body.user

      if (!email || !password) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const user: User | undefined = await this.userRepo.findOne({
        relations: ['userRole'],
        select: ['id', 'email', 'firstname', 'lastname', 'password'],
        where: {
          active: true,
          email
        }
      })

      // Wrong email or password
      if (!user || !(await UtilityService.verifyPassword(password, user.password))) {
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

  /**
   * Validate hash required for registration
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async validateHash(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { hash } = req.params

      if (!hash) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const invitation = await this.getUserInvitation(hash)
      return invitation
        ? res.status(204).send()
        : res.status(403).json({ status: 403, error: 'invalid hash' })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Register new user
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { hash } = req.params
      const { email, password } = req.body.user

      if (!email || !req.body.user) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const user: User | undefined = await this.userRepo.findOne({
        where: {
          email
        }
      })

      // Email is already taken
      if (user) {
        return res.status(400).json({ status: 400, error: 'email is already taken' })
      }

      const invitation: UserInvitation | undefined = await this.getUserInvitation(hash, email)

      // Invalid registration hash
      if (!invitation) {
        return res.status(403).json({ status: 403, error: 'invalid hash' })
      }

      const newUser: User = await this.userRepo.save({
        ...req.body.user,
        password: await UtilityService.hashPassword(password),
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

  /**
   * Create user invitation that is required for registration
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async createUserInvitation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { email } = req.body

      if (!email) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const hash = UtilityService.generateUuid()

      await this.userInvRepo.save({
        email,
        hash
      })

      await this.authMailService.sendUserInvitation(req.body.email, hash)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Unregister user
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async unregisterUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { email } = req.user

      if (!email) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const user: User | undefined = await this.userRepo.findOne({
        where: {
          email
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

  /**
   *
   * @param {string} hash
   * @param {string} [email]
   * @returns {Promise<UserInvitation | undefined>} Returns user invitation
   */
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
