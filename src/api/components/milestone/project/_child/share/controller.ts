import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { getManager, Repository } from 'typeorm';

import { ProjectShareMailService } from './services/mail';

import { User } from '@global/user/model';
import { Project } from '@milestone/project/model';

export class ProjectShareController {
	private readonly userRepo: Repository<User> = getManager().getRepository('User');
	private readonly projectRepo: Repository<Project> = getManager().getRepository('Project');
	private readonly projectShareMailService: ProjectShareMailService = new ProjectShareMailService();

	/**
	 * Share a project via email with user
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async shareProject(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { projectID } = req.params;
			const { userIDs } = req.body;

			if (!projectID || !userIDs) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const projectToShare: Project | undefined = await this.projectRepo.findOne(projectID);

			if (!projectToShare) {
				return res.status(404).json({ status: 404, error: 'Project to share not found' });
			}

			for (const userID of userIDs) {
				const targetUser: User | undefined = await this.userRepo.findOne(userID);

				if (targetUser) {
					await this.projectShareMailService.sendProject(req.user, targetUser, projectToShare);
				}
			}

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
