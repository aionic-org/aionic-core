import { Router } from 'express';

import { registerGlobalRoutes } from './global/routes';
import { registerMilestoneRoutes } from './milestone/routes';

/**
 * Init Express api routes
 *
 * @param {Router} router
 * @param {string} prefix
 * @returns {void}
 */
export function registerApiRoutes(router: Router, prefix: string = ''): void {
  registerGlobalRoutes(router, prefix);
  registerMilestoneRoutes(router, prefix);
}
