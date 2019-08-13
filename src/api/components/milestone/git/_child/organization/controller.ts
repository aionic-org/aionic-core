import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { getManager, Repository } from 'typeorm';

import { GitHubService } from '../../services/GitHub';

import { GitRepository } from '../repository/model';
import { GitOrganization } from './model';

export class GitOrganizationController {
	private readonly gitHubService: GitHubService = new GitHubService();
	private readonly gitOrgRepo: Repository<GitOrganization> = getManager().getRepository('GitOrganization');
	private readonly gitRepositoryRepo: Repository<GitRepository> = getManager().getRepository('GitRepository');

	/**
	 * Read all git organizations from db
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async readGitOrgs(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const organizations: GitOrganization[] = await this.gitOrgRepo.find();

			return res.json({ status: res.statusCode, data: organizations });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Save new git organization and its repos to db
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async createGitOrg(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { name } = req.body;

			if (!name) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const organization: GitOrganization | undefined = await this.gitOrgRepo.findOne({
				where: {
					name
				}
			});

			if (organization) {
				return res.status(400).json({ status: 400, error: 'Organization already exists!' });
			}

			const newOrganization: GitOrganization = await this.synchOrganization(name);

			return res.json({ status: res.statusCode, data: newOrganization });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Update git organization and its repos to db
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async updateGitOrg(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { orgID } = req.params;
			const { name } = req.body;

			if (!orgID || !name) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const newOrganization: GitOrganization = await this.synchOrganization(name);

			return res.json({ status: res.statusCode, data: newOrganization });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Update git organization and its repos to db
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async deleteGitOrg(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { orgID } = req.params;

			if (!orgID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const organization: GitOrganization | undefined = await this.gitOrgRepo.findOne(orgID);

			if (!organization) {
				return res.status(404).json({ status: 404, error: 'Organization not found' });
			}

			// Remove organization and its repos
			await this.gitOrgRepo.remove(organization);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Load and store git organization data in db
	 *
	 * @param {string} organizationName
	 */
	private async synchOrganization(organizationName: string): Promise<GitOrganization> {
		// Load organization details from GitHub API
		const gitHubOrganization: GitOrganization = await this.gitHubService.getOrganization(organizationName);

		let newOrganization: GitOrganization = new GitOrganization();

		// Lookup for an existing organization with this name in db
		const existingOrganization: GitOrganization | undefined = await this.gitOrgRepo.findOne({
			where: {
				name: organizationName
			}
		});

		if (existingOrganization) {
			// Apply id from existing organization and overwrite in db
			gitHubOrganization.id = existingOrganization.id;
			newOrganization = await this.gitOrgRepo.save(gitHubOrganization);

			// Load organization repos from GitHub API
			const gitHubOrgRepos: GitRepository[] = await this.gitHubService.getOrganizationRepos(newOrganization);
			for (const gitHubRepo of gitHubOrgRepos) {
				// Lookup for an existing organization repo in db
				const existingOrgRepo: GitRepository | undefined = await this.gitRepositoryRepo.findOne({
					where: {
						name: gitHubRepo.name,
						organization: {
							id: newOrganization.id
						}
					}
				});

				// Apply ID from existing organization repo to overwrite in db
				if (existingOrgRepo) {
					gitHubRepo.id = existingOrgRepo.id;
				}

				// Save organization repo to db
				await this.gitRepositoryRepo.save(gitHubRepo);
			}
		} else {
			// Save new organization in db
			newOrganization = await this.gitOrgRepo.save(gitHubOrganization);

			// Load organization repos from GitHub API and save to db
			const repos: GitRepository[] = await this.gitHubService.getOrganizationRepos(newOrganization);
			for (const repo of repos) {
				await this.gitRepositoryRepo.save(repo);
			}
		}

		return newOrganization;
	}
}
