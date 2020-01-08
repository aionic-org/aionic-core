import { Router } from 'express';

import { AuthRoutes } from './auth/routes';

import { ConfigRoutes } from './config/routes';

import { AnnouncementRoutes } from './announcement/routes';
import { GitRoutes } from './git/routes';

import { UserInvitationRoutes } from './user-invitation/routes';
import { UserRoleRoutes } from './user-role/routes';
import { UserRoutes } from './user/routes';

/**
 * Init Express api routes (Global)
 *
 * @param router Router the routes are attached to
 * @param prefix Prefix for attached routes
 * @returns
 */
export function registerGlobalRoutes(router: Router, prefix: string = ''): void {
	router.use(`${prefix}/auth`, new AuthRoutes().router);

	router.use(`${prefix}/config`, new ConfigRoutes().router);

	router.use(`${prefix}/announcements`, new AnnouncementRoutes().router);
	router.use(`${prefix}/git`, new GitRoutes().router);

	router.use(`${prefix}/users`, new UserRoutes().router);
	router.use(`${prefix}/user-invitations`, new UserInvitationRoutes().router);
	router.use(`${prefix}/user-roles`, new UserRoleRoutes().router);
}
