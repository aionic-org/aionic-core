import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { Board } from '../../model';
import { BoardTasksService } from './service';
import { Task } from '@milestone/task/model';

export class BoardTasksController {
	private readonly service: BoardTasksService = new BoardTasksService();

	/**
	 * Read board tasks
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readBoardTasks(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { boardID } = req.params;

			if (!boardID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const board: Board | undefined = await this.service.read({
				where: {
					id: boardID
				}
			});

			if (!board) {
				return res.status(404).json({ status: 404, error: 'Board not found' });
			}

			const tasks: Task[] = await this.service.readBoardTasks(board);

			return res.json({ status: res.statusCode, data: tasks });
		} catch (err) {
			return next(err);
		}
	}
}
