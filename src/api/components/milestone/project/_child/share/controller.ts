import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { ProjectShareService } from './service';

import { UserService } from '@global/user/service';
import { ProjectService } from '@milestone/project/service';

import { User } from '@global/user/model';
import { Project } from '@milestone/project/model';

export class ProjectShareController {
	private readonly projectShareService: ProjectShareService = new ProjectShareService();
	private readonly projectService: ProjectService = new ProjectService();
	private readonly userService: UserService = new UserService();

	/**
	 * Share project
	 *
	 * @param req Express request
	 * @param res Express resposne
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async shareProject(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { projectID } = req.params;
			const { userIDs } = req.body;

			if (!projectID || !userIDs) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const projectToShare: Project | undefined = await this.projectService.readProject({
				where: {
					id: projectID
				}
			});

			if (!projectToShare) {
				return res.status(404).json({ status: 404, error: 'Project to share not found' });
			}

			const users: User[] = [];

			for (const userID of userIDs) {
				const user: User | undefined = await this.userService.readUser({
					where: {
						id: userID
					}
				});

				if (user) {
					users.push(user);
				}
			}

			await this.projectShareService.shareProject(req.user as User, users, projectToShare);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
