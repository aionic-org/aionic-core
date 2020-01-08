import { bind } from 'decko';
import { Repository, getManager } from 'typeorm';

import { IComponentService } from '../../../../index';

import { ProjectComment } from './model';

export class ProjectCommentService implements IComponentService<ProjectComment> {
	readonly defaultRelations: string[] = ['author'];

	readonly repo: Repository<ProjectComment> = getManager().getRepository(ProjectComment);

	/**
	 * Read all project comments from db
	 *
	 * @param projectID ID of project to read comments from
	 * @returns Returns an array of project comments
	 */
	@bind
	public readProjectComments(projectID: number): Promise<ProjectComment[]> {
		try {
			return this.repo.find({
				relations: this.defaultRelations,
				where: {
					project: {
						id: projectID
					}
				}
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Read a certain project comment from db
	 *
	 * @param projectID ID of project to read comment from
	 * @param commentID ID of comment to read
	 * @returns Returns a single project comment
	 */
	@bind
	public readProjectComment(projectID: number, commentID: number): Promise<ProjectComment | undefined> {
		try {
			return this.repo.findOne({
				relations: this.defaultRelations,
				where: {
					id: commentID,
					project: {
						id: projectID
					}
				}
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Save new or updated project comment to db
	 *
	 * @param projectComment Project comment to save
	 * @returns Returns saved project comment
	 */
	@bind
	public saveProjectComment(projectComment: ProjectComment): Promise<ProjectComment> {
		try {
			return this.repo.save(projectComment);
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Delete project comment from db
	 *
	 * @param projectComment Project comment to delete
	 * @returns {Promise<ProjectComment>} Returns deleted project comment
	 */
	@bind
	public async deleteProjectComment(projectComment: ProjectComment): Promise<ProjectComment> {
		try {
			return this.repo.remove(projectComment);
		} catch (err) {
			throw new Error(err);
		}
	}
}
