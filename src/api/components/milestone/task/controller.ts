import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { Like, FindConditions } from 'typeorm';

import { Task } from './model';
import { TaskService } from './service';

export class TaskController {
	private readonly service: TaskService = new TaskService();

	/**
	 * Read tasks
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readTasks(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { title, term, status, assignee, author, tag, organization, branch } = req.query;

			let where: FindConditions<Task> = {};

			if (title && title.length) {
				where = { ...where, title: Like(`%${title}%`) };
			}

			if (term && term.length) {
				where = { ...where, description: Like(`%${term}%`) };
			}

			if (status) {
				where = { ...where, status: { id: status } };
			}

			if (assignee) {
				where = { ...where, assignee: { id: assignee } };
			}

			if (author) {
				where = { ...where, author: { id: author } };
			}

			if (tag && tag.length) {
				where = { ...where, tags: Like(`%${tag}%`) };
			}

			if (organization) {
				where = { ...where, organization: { id: organization } };
			}

			if (branch && branch.length) {
				where = { ...where, branch };
			}

			const tasks: Task[] = await this.service.readTasks({
				where,
				relations: ['author', 'assignee', 'status', 'priority', 'repository']
			});

			return res.json({ status: res.statusCode, data: tasks });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Read task
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readTask(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { taskID } = req.params;

			if (!taskID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const task: Task | undefined = await this.service.readTask({
				where: {
					id: taskID
				}
			});

			return res.json({ status: res.statusCode, data: task });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Create task
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async createTask(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			if (!req.body.task) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const newTask: Task = await this.service.saveTask(req.body.task);

			return res.json({ status: res.statusCode, data: newTask });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Update task
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async updateTask(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { taskID } = req.params;

			if (!taskID || !req.body.task) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const task: Task | undefined = await this.service.readTask({
				where: {
					id: taskID
				}
			});

			if (!task) {
				return res.status(404).json({ status: 404, error: 'Task not found' });
			}

			await this.service.saveTask(req.body.task);

			/**
			 * We have to reload the model again since .save()
			 * does not return all columns on updates
			 */

			const updatedTask: Task | undefined = await this.service.readTask({
				where: {
					id: taskID
				}
			});

			return res.json({ status: res.statusCode, data: updatedTask });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Delete task
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async deleteTask(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { taskID } = req.params;

			if (!taskID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const task: Task | undefined = await this.service.readTask({
				where: {
					id: taskID
				}
			});

			if (!task) {
				return res.status(404).json({ status: 404, error: 'Task not found' });
			}

			await this.service.deleteTask(task);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
