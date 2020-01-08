import { Router } from 'express';

import { IComponentRoutes } from '../../index';

import { AuthService, PassportStrategy } from '@services/auth';

import { TaskController } from './controller';

import { TaskCommentRoutes } from './_child/comment/routes';
import { TaskScratchpadRoutes } from './_child/scratchpad/routes';
import { TaskShareRoutes } from './_child/share/routes';

export class TaskRoutes implements IComponentRoutes<TaskController> {
	readonly controller: TaskController = new TaskController();
	readonly router: Router = Router();
	authSerivce: AuthService;

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);

		this.initRoutes();
		this.initChildRoutes(defaultStrategy);
	}

	initRoutes(): void {
		this.router.get(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('task', 'read'),
			this.controller.readTasks
		);

		this.router.get(
			'/:taskID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('task', 'read'),
			this.controller.readTask
		);

		this.router.post(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('task', 'create'),
			this.controller.createTask
		);

		this.router.put(
			'/:taskID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('task', 'update'),
			this.controller.updateTask
		);

		this.router.delete(
			'/:taskID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('task', 'delete'),
			this.controller.deleteTask
		);
	}

	initChildRoutes(defaultStrategy?: PassportStrategy): void {
		this.router.use('/:taskID', new TaskCommentRoutes(defaultStrategy).router);
		this.router.use('/:taskID', new TaskScratchpadRoutes(defaultStrategy).router);
		this.router.use('/:taskID', new TaskShareRoutes(defaultStrategy).router);
	}
}
