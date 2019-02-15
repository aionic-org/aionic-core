import { initComponentRoutes } from './components'
import { initErrorHandler, initMiddleware } from './middleware'

import { Router } from 'express'

/**
 * Init Express REST routes
 *
 * @param {Router} router
 * @returns {void}
 */
export function initRestRoutes(router: Router): void {
  const prefix: string = '/api/v1'

  initMiddleware(router)
  initComponentRoutes(router, prefix)
  initErrorHandler(router)
}
