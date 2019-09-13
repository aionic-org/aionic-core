import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { ProjectComment } from './model';
import { ProjectCommentService } from './service';

export class ProjectCommentController {
	private readonly service: ProjectCommentService = new ProjectCommentService();

	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async readProjectComments(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { projectID } = req.params;

			if (!projectID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const comments: ProjectComment[] = await this.service.readProjectComments(parseInt(projectID, 10));

			return res.json({ status: res.statusCode, data: comments });
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
	public async createProjectComment(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { projectID } = req.params;

			if (!projectID || !req.body.comment) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const newComment: ProjectComment = await this.service.saveProjectComment({
				...req.body.comment,
				author: req.user,
				project: { id: projectID }
			});

			return res.json({ status: res.statusCode, data: newComment });
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
	public async deleteProjectComment(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { projectID, commentID } = req.params;

			if (!projectID || !commentID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const comment: ProjectComment | undefined = await this.service.readProjectComment(
				parseInt(projectID, 10),
				parseInt(commentID, 10)
			);

			if (!comment) {
				return res.status(404).json({ status: 404, error: 'Comment not found' });
			}

			await this.service.deleteProjectComment(comment);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
