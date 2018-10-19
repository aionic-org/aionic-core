import { bind } from 'decko'
import { use } from 'passport'
import { sign, SignOptions } from 'jsonwebtoken'
import { Request, Response, NextFunction, Handler } from 'express'
import { StrategyOptions, ExtractJwt } from 'passport-jwt'

import { JwtStrategy } from '../modules/auth/strategies/jwt'
import { BasicAuthStrategy } from '../modules/auth/strategies/basicAuth'

import { permissions } from '../config/permissions'

/**
 *
 * - AuthService -
 *
 * Available passport strategies for authentication:
 *  - JWT (default)
 *  - Basic Auth
 *
 * Pass a strategy when initializing module routes to setup this strategy for the complete module
 * Each router's endpoint from the module will be protected
 * Example: new UserRoutes('jwt')
 *
 * To setup a strategy for individual endpoints in a module pass the strategy on isAuthorized call
 * Example: isAuthorized('basic')
 *
 */
export class AuthService {
  private defaultStrategy: string
  private jwtStrategy: JwtStrategy
  private basicStrategy: BasicAuthStrategy

  private readonly strategyOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'aionic-secret-api-key',
    audience: 'aionic-client',
    issuer: 'aionic-api'
  }

  // jwt options
  private readonly signOptions: SignOptions = {
    expiresIn: '8h',
    audience: this.strategyOptions.audience,
    issuer: this.strategyOptions.issuer
  }

  public constructor(defaultStrategy: string = 'jwt') {
    // setup default strategy -> use jwt if none is provided
    this.defaultStrategy = defaultStrategy

    this.jwtStrategy = new JwtStrategy(this.strategyOptions)
    this.basicStrategy = new BasicAuthStrategy()
  }

  /**
   * create JWT
   *
   * @param {number} userID
   * @returns {string}
   */
  public createToken(userID: number): string {
    const payload = { userID: userID }

    return sign(payload, this.strategyOptions.secretOrKey, this.signOptions)
  }

  /**
   * Middleware for verifying user permissions from acl
   *
   * @param {string} resource
   * @param {string} permission
   *
   * @returns {Handler}
   */
  public hasPermission(resource: string, permission: string): Handler {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const uid: number = req.user.id
        const access: boolean = await permissions.isAllowed(uid, resource, permission)

        if (!access) {
          return res.status(401).json({
            status: 401,
            error: 'missing user rights'
          })
        }

        return next()
      } catch (err) {
        return next(err)
      }
    }
  }

  /**
   * init passport strategies
   *
   * @returns {void}
   */
  public initStrategies(): void {
    use('jwt', this.jwtStrategy.strategy)
    use('basic', this.basicStrategy.strategy)
  }

  /**
   * setup target passport authorization
   *
   * @param {string} strategy
   * @returns {Handler}
   */
  @bind
  public isAuthorized(strategy?: string): Handler {
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        // if no strategy is provided use default strategy
        const tempStrategy = strategy || this.defaultStrategy
        return this.doAuthentication(req, res, next, tempStrategy)
      } catch (err) {
        return next(err)
      }
    }
  }

  /**
   * executes the target passport authorization
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @param {string} strategy
   * @returns {any}
   */
  @bind
  private doAuthentication(req: Request, res: Response, next: NextFunction, strategy: string): any {
    try {
      switch (strategy) {
        case 'jwt':
          return this.jwtStrategy.isAuthorized(req, res, next)
        case 'basic':
          return this.basicStrategy.isAuthorized(req, res, next)
        default:
          throw new Error(`Unknown passport strategy: ${this.defaultStrategy}`)
      }
    } catch (err) {
      return next(err)
    }
  }
}
