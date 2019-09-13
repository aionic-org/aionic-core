import { bind } from 'decko';
import { Repository, FindManyOptions, FindOneOptions, getManager } from 'typeorm';

import { Project } from './model';

export class ProjectService {
	private readonly defaultRelations: string[] = ['author', 'tasks', 'tasks.status'];

	private readonly repo: Repository<Project> = getManager().getRepository(Project);

	/**
	 * Read all projects from db
	 *
	 * @param {FindManyOptions<Project>} options = {}
	 * @returns {Promise<Project[]>} Returns an array of projects
	 */
	@bind
	public readProjects(options: FindManyOptions<Project>): Promise<Project[]> {
		try {
			return this.repo.find({
				relations: this.defaultRelations,
				...options
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Read a certain project from db
	 *
	 * @param {FindOneOptions<Project>} options = {}
	 * @returns {Promise<Project | undefined>} Returns a single project
	 */
	@bind
	public readProject(options: FindOneOptions<Project>): Promise<Project | undefined> {
		try {
			return this.repo.findOne({
				relations: this.defaultRelations,
				...options
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Save new or updated project to db
	 *
	 * @param {Project} project
	 * @returns {Promise<Project>} Returns saved project
	 */
	@bind
	public saveProject(project: Project): Promise<Project> {
		try {
			return this.repo.save(project);
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Delete project from db
	 *
	 * @param {Project} project
	 * @returns {Promise<Project>} Returns deleted project
	 */
	@bind
	public async deleteProject(project: Project): Promise<Project> {
		try {
			return this.repo.remove(project);
		} catch (err) {
			throw new Error(err);
		}
	}
}
