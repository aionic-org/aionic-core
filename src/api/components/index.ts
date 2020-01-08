import { Repository } from 'typeorm';
import { Router } from 'express';

import { registerGlobalRoutes } from './global/routes';
import { registerMilestoneRoutes } from './milestone/routes';

import { CacheService } from '@services/cache';
import { AuthService } from '@services/auth';

export interface IComponentService<T> {
	readonly repo: Repository<T>;
	readonly cacheService?: CacheService;
	readonly defaultRelations?: string[];
}

export interface IComponentRoutes<T> {
	readonly controller: T;
	readonly router: Router;
	authSerivce: AuthService;

	initRoutes(): void;
	initChildRoutes?(): void;
}

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
