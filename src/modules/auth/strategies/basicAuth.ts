import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { authenticate } from 'passport'
import { BasicStrategy } from 'passport-http'

import { User } from '../../user/model'

import { HelperService } from '../../../services/helper'

import { BaseStrategy } from './base'

/**
 * Passport Basic Http Authentication
 *
 * The client sends a base64 encoded string, including username:password, inside the request header
 *
 * NOTE: No signin is needed
 * *
 */
export class BasicAuthStrategy extends BaseStrategy {
  private readonly helperService: HelperService = new HelperService()

  public constructor() {
    super()
    this._strategy = new BasicStrategy(this.verify)
  }

  /**
   * Middleware for checking if a user is authorized to access the endpoint
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {void}
   */
  public isAuthorized(req: Request, res: Response, next: NextFunction): void {
    try {
      return authenticate('basic', { session: false }, (error, user, info) => {
        if (error) {
          return next(error)
        }

        if (!user) {
          return res.status(401).json({
            data: 'user is not authorized',
            status: 401
          })
        }

        // success - store user in req scope
        req.user = user

        return next()
      })(req, res, next)
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Verify incoming userID / password from request -> validation in isAuthorized()
   *
   * @param {any} payload
   * @param {any} next
   * @returns {Handler}
   */
  @bind
  private async verify(username: string, password: string, next: any): Promise<void> {
    try {
      // pass error == null on error otherwise we get a 500 error instead of 401

      const user: User | undefined = await this.userRepo.findOne({
        relations: ['userRole'],
        select: ['id', 'password'],
        where: {
          active: true,
          username
        }
      })

      if (!user) {
        return next(null, null)
      }

      // Verify password
      if (!(await this.helperService.verifyPassword(password, user.password))) {
        return next(null, null)
      }

      await this.setPermissions(user)

      return next(null, user)
    } catch (err) {
      return next(err)
    }
  }
}
