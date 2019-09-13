import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { TaskScratchpadService } from './service';
import { TaskScratchpad } from './model';

export class ScratchpadController {
	private readonly service: TaskScratchpadService = new TaskScratchpadService();

	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async readTaskScratchpadByUser(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { taskID, userID } = req.params;

			if (!taskID || !userID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const scratchpad: TaskScratchpad | undefined = await this.service.readTaskScratchpad({
				author: { id: parseInt(userID, 10) },
				task: { id: parseInt(taskID, 10) }
			});

			return res.json({ status: res.statusCode, data: scratchpad });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async saveTaskScratchpad(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			if (!req.body.scratchpad) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const newScratchpad: TaskScratchpad = await this.service.saveTaskScratchpad(req.body.scratchpad);

			return res.json({ status: res.statusCode, data: newScratchpad });
		} catch (err) {
			return next(err);
		}
	}
}
