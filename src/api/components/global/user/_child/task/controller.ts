import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { Task } from '@milestone/task/model';
import { UserTaskService } from '@global/user/_child/task/service';
import { User } from '@global/user/model';

export class UserTaskController {
	readonly userService: UserTaskService = new UserTaskService();

	/**
	 * Read tasks from user
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readUserTasks(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { userID } = req.params;

			if (!userID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const user: User | undefined = await this.userService.read({
				where: {
					id: userID
				}
			});

			if (!user) {
				return res.status(404).json({ status: 404, error: 'User not found' });
			}

			const tasks: Task[] = await this.userService.readUserTasks(user);

			return res.json({ status: res.statusCode, data: tasks });
		} catch (err) {
			return next(err);
		}
	}
}
