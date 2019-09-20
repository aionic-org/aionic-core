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
	 * @param where Find conditions
	 * @param cached Read task priorities from cache
	 * @returns Returns an array of task priorities
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
				return this.cacheService.get('task-priorities', this.readTaskPriorities);
			}

			return this.repo.find();
		} catch (err) {
			throw new Error(err);
		}
	}
}
