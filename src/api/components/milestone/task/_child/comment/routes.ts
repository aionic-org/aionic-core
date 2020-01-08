import { Router } from 'express';

import { IComponentRoutes } from '../../../../index';

import { AuthService, PassportStrategy } from '@services/auth';

import { TaskCommentController } from './controller';

export class TaskCommentRoutes implements IComponentRoutes<TaskCommentController> {
	readonly controller: TaskCommentController = new TaskCommentController();
	readonly router: Router = Router({ mergeParams: true });
	authSerivce: AuthService;

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	initRoutes(): void {
		this.router.get(
			'/comments',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('taskComment', 'read'),
			this.controller.readTaskComments
		);

		this.router.post(
			'/comments',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('taskComment', 'create'),
			this.controller.createTaskComment
		);

		this.router.delete(
			'/comments/:commentID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('taskComment', 'delete'),
			this.controller.deleteTaskComment
		);
	}
}
