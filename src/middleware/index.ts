import compression from 'compression'
import cors from 'cors'
import helmet from 'helmet'

import { json, NextFunction, Request, Response, Router } from 'express'

import { AuthService } from '../services/auth'
import { UtilityService } from '../services/utility'

/**
 * Init Express middleware
 *
 * @param {Router} router
 */
export function initMiddleware(router: Router): void {
  router.use(helmet())
  router.use(cors({ origin: 'http://localhost:4200' }))
  router.use(json())
  router.use(compression())

  // Setup passport strategies
  new AuthService().initStrategies()
}

/**
 * Init Express error handler
 *
 * @param {Router} router
 */
export function initErrorHandler(router: Router): Response | void {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    UtilityService.handleError(err)

    return res.status(500).json({
      error: err.stack || err,
      status: 500
    })
  })
}
