import { bind } from 'decko';
import { Repository, getManager } from 'typeorm';

import { IComponentService } from '../../../../index';

import { TaskComment } from './model';

export class TaskCommentService implements IComponentService<TaskComment> {
	readonly defaultRelations: string[] = ['author'];

	readonly repo: Repository<TaskComment> = getManager().getRepository(TaskComment);

	/**
	 * Read all task comments from db
	 *
	 * @param taskID ID of task to read comments from
	 * @returns Returns an array of task comments
	 */
	@bind
	public readTaskComments(taskID: number): Promise<TaskComment[]> {
		try {
			return this.repo.find({
				relations: this.defaultRelations,
				where: {
					task: {
						id: taskID
					}
				}
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Read a certain task comment from db
	 *
	 * @param taskID ID of task to read comments from
	 * @param commentID ID of comment to read
	 * @returns Returns a single task comment
	 */
	@bind
	public readTaskComment(taskID: number, commentID: number): Promise<TaskComment | undefined> {
		try {
			return this.repo.findOne({
				relations: this.defaultRelations,
				where: {
					id: commentID,
					task: {
						id: taskID
					}
				}
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Save new or updated task comment to db
	 *
	 * @param taskComment Task comment to save
	 * @returns Returns saved task comment
	 */
	@bind
	public saveTaskComment(taskComment: TaskComment): Promise<TaskComment> {
		try {
			return this.repo.save(taskComment);
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Delete task comment from db
	 *
	 * @param taskComment Task comment to delete
	 * @returns {Promise<TaskComment>} Returns deleted task comment
	 */
	@bind
	public async deleteTaskComment(taskComment: TaskComment): Promise<TaskComment> {
		try {
			return this.repo.remove(taskComment);
		} catch (err) {
			throw new Error(err);
		}
	}
}
