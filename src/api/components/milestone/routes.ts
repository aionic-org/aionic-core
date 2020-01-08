import { Router } from 'express';

import { BoardRoutes } from './board/routes';
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
	router.use(`${prefix}/boards`, new BoardRoutes().router);
	router.use(`${prefix}/projects`, new ProjectRoutes().router);
	router.use(`${prefix}/tasks`, new TaskRoutes().router);
	router.use(`${prefix}/task-priorities`, new TaskPriorityRoutes().router);
	router.use(`${prefix}/task-status`, new TaskStatusRoutes().router);
}
