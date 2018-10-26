import { bind } from 'decko'
import { authenticate } from 'passport'
import { BasicStrategy } from 'passport-http'
import { Request, Response, NextFunction, Handler } from 'express'

import { User } from '../../user/model'

import { HelperService } from '../../../services/helper'

import { BaseStrategy } from './base'

/**
 *
 * - Passport Basic Http Authentication -
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
   * middleware for checking if a user is authorized to access the endpoint
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Handler}
   */
  public isAuthorized(req: Request, res: Response, next: NextFunction): Handler {
    try {
      return authenticate('basic', { session: false }, (error, user, info) => {
        console.log('BASIC-AUTH Authorization: ', error, user, info)

        if (error) {
          return next(error)
        }

        if (!user) {
          return res.status(401).json({
            status: 401,
            data: 'user is not authorized'
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
   * verify incoming userID / password from request -> validation in isAuthorized()
   *
   * @param {any} payload
   * @param {any} next
   * @returns {Handler}
   */
  @bind
  private async verify(username, password, next): Handler {
    try {
      // pass error == null on error otherwise we get a 500 error instead of 401
      console.log('Incoming basic auth header: ', username, password)

      const user: User = await this.userRepo.findOne({
        select: ['id', 'password'],
        where: {
          username: username,
          active: true
        },
        relations: ['userRole']
      })

      // verify username
      if (!user) {
        return next(null, null)
      }

      // verify password
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
