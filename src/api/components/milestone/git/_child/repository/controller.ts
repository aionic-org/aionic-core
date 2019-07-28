import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { getManager, Repository } from 'typeorm';

import { GitHubService, ICommit } from '@milestone/git/services/GitHub';

import { GitOrganization } from '../organization/model';
import { GitRepository } from './model';

export class GitRepositoryController {
	private readonly gitHubService: GitHubService = new GitHubService();

	private readonly gitOrgRepo: Repository<GitOrganization> = getManager().getRepository('GitOrganization');
	private readonly gitRepositoryRepo: Repository<GitRepository> = getManager().getRepository('GitRepository');

	/**
	 * Read all git organization repositories from db
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async readGitOrgRepos(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { orgId } = req.params;

			if (!orgId) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const repositories: GitRepository[] = await this.gitRepositoryRepo.find({
				where: {
					organization: {
						id: orgId
					}
				}
			});

			return res.json({ status: res.statusCode, data: repositories });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Read git organization repository commits from GitHub API
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async readGitOrgRepoCommits(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { orgId, repoId, branch } = req.params;

			if (!orgId || !repoId || !branch) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const org: GitOrganization = (await this.gitOrgRepo.findOne(orgId)) as GitOrganization;
			const repo: GitRepository = (await this.gitRepositoryRepo.findOne(repoId)) as GitRepository;

			const commits: ICommit[] = await this.gitHubService.getBranchCommits(org, repo, branch);

			return res.json({ status: res.statusCode, data: commits });
		} catch (err) {
			return next(err);
		}
	}
}
