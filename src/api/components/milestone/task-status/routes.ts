import { Router } from 'express';

import { AuthService, PassportStrategy } from '@services/auth';
import { TaskStatusController } from './controller';

export class TaskStatusRoutes {
	private readonly controller: TaskStatusController = new TaskStatusController();
	private authSerivce: AuthService;
	private _router: Router = Router();

	public constructor(defaultStrategy?: PassportStrategy) {
		this.authSerivce = new AuthService(defaultStrategy);
		this.initRoutes();
	}

	public get router(): Router {
		return this._router;
	}

	private initRoutes(): void {
		this.router.get(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('task-status', 'read'),
			this.controller.readTaskStatus
		);

		this.router.get(
			'/:taskStatusID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('task-status', 'read'),
			this.controller.readSingleTaskStatus
		);

		this.router.post(
			'/',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('task-status', 'create'),
			this.controller.createTaskStatus
		);

		this.router.put(
			'/:taskStatusID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('task-status', 'update'),
			this.controller.updateTaskStatus
		);

		this.router.delete(
			'/:taskStatusID',
			this.authSerivce.isAuthorized(),
			this.authSerivce.hasPermission('task-status', 'delete'),
			this.controller.deleteTaskStatus
		);
	}
}
