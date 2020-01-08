import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { getManager, Repository } from 'typeorm';

import { GitHubService, ICommit } from '@global/git/services/GitHub';

import { GitOrganization } from '../organization/model';
import { GitRepository } from './model';

export class GitRepositoryController {
	private readonly gitHubService: GitHubService = new GitHubService();

	private readonly gitOrgRepo: Repository<GitOrganization> = getManager().getRepository('GitOrganization');
	private readonly gitRepositoryRepo: Repository<GitRepository> = getManager().getRepository('GitRepository');

	/**
	 * Read Git organization repositories
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readGitOrgRepos(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { orgID } = req.params;

			if (!orgID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const repositories: GitRepository[] = await this.gitRepositoryRepo.find({
				where: {
					organization: {
						id: orgID
					}
				}
			});

			return res.json({ status: res.statusCode, data: repositories });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Read Git organization repository commits
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readGitOrgRepoCommits(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { orgID, repoID, branch } = req.params;

			if (!orgID || !repoID || !branch) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const org: GitOrganization = (await this.gitOrgRepo.findOne(orgID)) as GitOrganization;
			const repo: GitRepository = (await this.gitRepositoryRepo.findOne(repoID)) as GitRepository;

			const commits: ICommit[] = await this.gitHubService.getBranchCommits(org, repo, branch);

			return res.json({ status: res.statusCode, data: commits });
		} catch (err) {
			return next(err);
		}
	}
}
