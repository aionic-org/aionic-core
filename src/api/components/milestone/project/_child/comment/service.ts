import { bind } from 'decko';
import { Repository, getManager } from 'typeorm';

import { ProjectComment } from './model';

export class ProjectCommentService {
	private readonly defaultRelations: string[] = ['author'];

	private readonly repo: Repository<ProjectComment> = getManager().getRepository(ProjectComment);

	/**
	 * Read all project comments from db
	 *
	 * @param {number} projectID
	 * @returns {Promise<ProjectComment[]>} Returns an array of project comments
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
	 * @param {number} projectID
	 * @param {number} commentID
	 * @returns {Promise<ProjectComment | undefined>} Returns a single project comment
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
	 * @param {ProjectComment} projectComment
	 * @returns {Promise<ProjectComment>} Returns saved project comment
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
	 * @param {ProjectComment} projectComment
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
