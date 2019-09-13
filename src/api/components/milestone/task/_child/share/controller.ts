import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { TaskShareService } from './service';

import { UserService } from '@global/user/service';
import { TaskService } from '@milestone/task/service';

import { User } from '@global/user/model';
import { Task } from '@milestone/task/model';

export class TaskShareController {
	private readonly taskShareService: TaskShareService = new TaskShareService();
	private readonly taskService: TaskService = new TaskService();
	private readonly userService: UserService = new UserService();

	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async shareTask(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { taskID } = req.params;
			const { userIDs } = req.body;

			if (!taskID || !userIDs) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const taskToShare: Task | undefined = await this.taskService.readTask({
				where: {
					id: taskID
				}
			});

			if (!taskToShare) {
				return res.status(404).json({ status: 404, error: 'Task to share not found' });
			}

			const users: User[] = [];

			for (const userID of userIDs) {
				const user: User | undefined = await this.userService.readUser({
					where: { id: userID }
				});

				if (user) {
					users.push(user);
				}
			}

			await this.taskShareService.shareTask(req.user as User, users, taskToShare);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
