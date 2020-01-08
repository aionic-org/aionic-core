import { Router } from 'express';

import { IComponentRoutes } from '../../index';

import { AuthService, PassportStrategy } from '@services/auth';

import { ConfigController } from './controller';

export class ConfigRoutes implements IComponentRoutes<ConfigController> {
	readonly router: Router = Router();
	readonly controller: ConfigController = new ConfigController();
	authSerivce: AuthService;

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	initRoutes(): void {
		/**
		 * Caches
		 */
		this.router.get(
			'/caches',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('config', 'getCachesMetadata'),
			this.controller.getCachesMetadata
		);
		this.router.delete(
			'/caches',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('config', 'deleteCachesMetadata'),
			this.controller.deleteCachesMetadata
		);
		this.router.get(
			'/caches/:key',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('config', 'getCacheKeyData'),
			this.controller.getCacheKeyData
		);
		this.router.delete(
			'/caches/:key',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('config', 'deleteCacheKeyData'),
			this.controller.deleteCacheKeyData
		);

		/**
		 * Logs
		 */
		this.router.get(
			'/logs',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('config', 'getLogfiles'),
			this.controller.getLogfiles
		);
		this.router.get(
			'/logs/:logfile',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('config', 'readLogfile'),
			this.controller.readLogfile
		);
		this.router.delete(
			'/logs/:logfile',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('config', 'deleteLogfile'),
			this.controller.deleteLogfile
		);
		this.router.get(
			'/logs/:logfile/download',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('config', 'downloadLogfile'),
			this.controller.downloadLogfile
		);
	}
}
