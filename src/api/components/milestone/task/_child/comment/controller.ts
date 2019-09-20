import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { TaskCommentService } from './service';
import { TaskComment } from './model';

export class TaskCommentController {
	private readonly service: TaskCommentService = new TaskCommentService();

	/**
	 * Read task comments
	 *
	 * @param req Express request
	 * @param res Express reponse
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readTaskComments(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { taskID } = req.params;

			if (!taskID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const comments: TaskComment[] = await this.service.readTaskComments(parseInt(taskID, 10));

			return res.json({ status: res.statusCode, data: comments });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Create task comment
	 *
	 * @param req Express request
	 * @param res Express reponse
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async createTaskComment(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { taskID } = req.params;

			if (!taskID || !req.body.comment) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			// TODO: Check if task exists

			const newComment: TaskComment = await this.service.saveTaskComment({
				...req.body.comment,
				author: req.user,
				task: { id: taskID }
			});

			return res.json({ status: res.statusCode, data: newComment });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Delete task comment
	 *
	 * @param req Express request
	 * @param res Express reponse
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async deleteTaskComment(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { taskID, commentID } = req.params;

			if (!taskID || !commentID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const comment: TaskComment | undefined = await this.service.readTaskComment(
				parseInt(taskID, 10),
				parseInt(commentID, 10)
			);

			if (!comment) {
				return res.status(404).json({ status: 404, error: 'Comment not found' });
			}

			await this.service.deleteTaskComment(comment);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
