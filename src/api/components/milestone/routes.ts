import { Router } from 'express';

import { AnnouncementRoutes } from './announcement/routes';
import { BoardRoutes } from './board/routes';
import { GitRoutes } from './git/routes';
import { ProjectRoutes } from './project/routes';
import { TaskPriorityRoutes } from './task-priority/routes';
import { TaskStatusRoutes } from './task-status/routes';
import { TaskRoutes } from './task/routes';

/**
 * Init Express api routes (Milestone)
 *
 * @param router Router the routes are attached to
 * @param prefix Prefix for attached routes
 * @returns
 */
export function registerMilestoneRoutes(router: Router, prefix: string = ''): void {
	router.use(`${prefix}/announcements`, new AnnouncementRoutes().router);
	router.use(`${prefix}/boards`, new BoardRoutes().router);
	router.use(`${prefix}/git`, new GitRoutes().router);
	router.use(`${prefix}/projects`, new ProjectRoutes().router);
	router.use(`${prefix}/tasks`, new TaskRoutes().router);
	router.use(`${prefix}/task-priorities`, new TaskPriorityRoutes().router);
	router.use(`${prefix}/task-status`, new TaskStatusRoutes().router);
}
