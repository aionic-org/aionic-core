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
			const status: TaskStatus[] = await this.service.readTaskStatus({}, true);

			return res.json({ status: res.statusCode, data: status });
		} catch (err) {
			return next(err);
		}
	}
}
