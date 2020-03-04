import { registerComponentRoutes } from './components';
import { registerErrorHandler, registerMiddleware } from './middleware';

import { Router } from 'express';

/**
 * Init Express REST routes
 *
 * @param {Router} router
 * @returns {void}
 */
export function registerApiRoutes(router: Router): void {
	const prefix: string = '/api/v1';

	registerMiddleware(router);
	registerComponentRoutes(router, prefix);
	registerErrorHandler(router);
}
