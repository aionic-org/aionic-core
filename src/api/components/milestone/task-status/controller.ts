import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { TaskStatus } from './model';
import { TaskStatusService } from './service';

export class TaskStatusController {
	private readonly service: TaskStatusService = new TaskStatusService();

	/**
	 * Read task status
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readTaskStatus(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const status: TaskStatus[] = await this.service.readAll({}, true);

			return res.json({ status: res.statusCode, data: status });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Read single task-status
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readSingleTaskStatus(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { taskStatusID } = req.params;

			if (!taskStatusID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const taskStatus: TaskStatus | undefined = await this.service.read({
				where: {
					id: taskStatusID
				}
			});

			return res.json({ status: res.statusCode, data: taskStatus });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Create task-status
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async createTaskStatus(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			if (!req.body.taskStatus) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const newTaskStatus: TaskStatus = await this.service.save(req.body.taskStatus);

			return res.json({ status: res.statusCode, data: newTaskStatus });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Update task-status
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async updateTaskStatus(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { taskStatusID } = req.params;

			if (!taskStatusID || !req.body.taskStatus) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const taskStatus: TaskStatus | undefined = await this.service.read({
				where: {
					id: taskStatusID
				}
			});

			if (!taskStatus) {
				return res.status(404).json({ status: 404, error: 'Task-Status not found' });
			}

			const updatedTask: TaskStatus | undefined = await this.service.save(req.body.taskStatus);

			return res.json({ status: res.statusCode, data: updatedTask });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Delete task-status
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async deleteTaskStatus(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { taskStatusID } = req.params;

			if (!taskStatusID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const taskStatus: TaskStatus | undefined = await this.service.read({
				where: {
					id: taskStatusID
				}
			});

			if (!taskStatus) {
				return res.status(404).json({ status: 404, error: 'Task-Status not found' });
			}

			await this.service.delete(taskStatus);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
