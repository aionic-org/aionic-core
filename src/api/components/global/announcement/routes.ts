import { Router } from 'express';

import { IComponentRoutes } from '../../index';

import { AuthService, PassportStrategy } from '@services/auth';

import { AnnouncementController } from './controller';

export class AnnouncementRoutes implements IComponentRoutes<AnnouncementController> {
	readonly controller: AnnouncementController = new AnnouncementController();
	readonly router: Router = Router();
	authSerivce: AuthService;

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);

		this.initRoutes();
	}

	initRoutes(): void {
		this.router.get(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('announcement', 'read'),
			this.controller.readAnnouncements
		);

		this.router.get(
			'/:announcementID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('announcement', 'read'),
			this.controller.readAnnouncement
		);

		this.router.post(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('announcement', 'create'),
			this.controller.createAnnouncement
		);

		this.router.delete(
			'/:announcementID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('announcement', 'delete'),
			this.controller.deleteAnnouncement
		);
	}
}
