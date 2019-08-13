import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { getManager, Repository } from 'typeorm';

import { TaskShareMailService } from './services/mail';

import { User } from '@global/user/model';
import { Task } from '@milestone/task/model';

export class TaskShareController {
	private readonly userRepo: Repository<User> = getManager().getRepository('User');
	private readonly taskRepo: Repository<Task> = getManager().getRepository('Task');
	private readonly taskShareMailService: TaskShareMailService = new TaskShareMailService();

	/**
	 * Share a task via email with user
	 *
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

			const taskToShare: Task | undefined = await this.taskRepo.findOne(taskID);

			if (!taskToShare) {
				return res.status(404).json({ status: 404, error: 'Task to share not found' });
			}

			for (const userID of userIDs) {
				const targetUser: User | undefined = await this.userRepo.findOne(userID);

				if (targetUser) {
					await this.taskShareMailService.sendTask(req.user, targetUser, taskToShare);
				}
			}

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
