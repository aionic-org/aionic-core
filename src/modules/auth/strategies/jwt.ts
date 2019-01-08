import { bind } from 'decko'
import { authenticate } from 'passport'
import { Strategy, StrategyOptions } from 'passport-jwt'
import { Request, Response, NextFunction, Handler } from 'express'

import { BaseStrategy } from './base'

/**
 *
 * - Passport JWT Authentication -
 *
 * The client signs in via /signin endpoint
 * If the signin is successfull a JWT is returned
 * This JWT is used inside the request header for later requests
 *
 */
export class JwtStrategy extends BaseStrategy {
  private strategyOptions: StrategyOptions

  public constructor(strategyOptions: StrategyOptions) {
    super()
    this.strategyOptions = strategyOptions
    this._strategy = new Strategy(this.strategyOptions, this.verify)
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
      authenticate('jwt', { session: false }, (error, user, info) => {
        // internal error
        if (error) {
          return next(error)
        }

        if (info) {
          switch (info.message) {
            case 'No auth token':
              return res.status(401).json({
                status: 401,
                error: 'No jwt provided.'
              })

            case 'jwt expired':
              return res.status(403).json({
                status: 403,
                error: 'jwt expired.'
              })
          }
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
   * verify incoming payloads from request -> validation in isAuthorized()
   *
   * @param {any} payload
   * @param {any} next
   * @returns {Handler}
   */
  @bind
  private async verify(payload, next): Handler {
    try {
      // pass error == null on error otherwise we get a 500 error instead of 401

      const user = await this.userRepo.findOne({
        where: {
          id: payload.userID,
          active: true
        },
        relations: ['userRole']
      })

      if (!user) {
        return next(null, null)
      }

      await this.setPermissions(user)

      return next(null, user)
    } catch (err) {
      return next(err)
    }
  }
}
