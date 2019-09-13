import { bind } from 'decko';
import { Repository, FindConditions, getManager } from 'typeorm';

import { CacheService } from '@services/cache';

import { TaskPriority } from './model';

export class TaskPriorityService {
	private readonly cacheService: CacheService = new CacheService();

	private readonly repo: Repository<TaskPriority> = getManager().getRepository(TaskPriority);

	/**
	 * Read all task priorities from db
	 *
	 * @param {FindConditions<TaskPriority>} where = {}
	 * @param {boolean} cached = false
	 * @returns {Promise<TaskPriority[]>} Returns array of task priorities
	 */
	@bind
	public async readTaskPriorities(
		where: FindConditions<TaskPriority> = {},
		cached: boolean = false
	): Promise<TaskPriority[]> {
		try {
			if (Object.keys(where).length) {
				return this.repo.find({
					where
				});
			}

			if (cached) {
				return this.cacheService.get('taskPriority', this);
			}

			return this.repo.find();
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Get target content for cache service
	 *
	 * @returns {Promise<TaskPriority[]>}
	 */
	@bind
	private getCachedContent(): Promise<TaskPriority[]> {
		return this.repo.find();
	}
}
