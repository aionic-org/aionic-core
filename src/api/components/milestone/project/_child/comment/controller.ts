import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { getManager, Repository } from 'typeorm';

import { ProjectComment } from './model';

export class ProjectCommentController {
	private readonly projectCommentRepo: Repository<ProjectComment> = getManager().getRepository('ProjectComment');

	/**
	 * Read all comments from a certain project from db
	 *
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

			const comments: ProjectComment[] = await this.projectCommentRepo.find({
				relations: ['author'],
				where: {
					project: {
						id: projectID
					}
				}
			});

			return res.json({ status: res.statusCode, data: comments });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Save new project comment to db
	 *
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

			const newComment: ProjectComment = await this.projectCommentRepo.save({
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
	 * Delete project comment from db
	 *
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

			const comment: ProjectComment | undefined = await this.projectCommentRepo.findOne({
				where: {
					id: commentID,
					project: {
						id: projectID
					}
				}
			});

			if (!comment) {
				return res.status(404).json({ status: 404, error: 'Comment not found' });
			}

			await this.projectCommentRepo.remove(comment);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
