import { bind } from 'decko';
import { Repository, FindConditions, getManager } from 'typeorm';

import { CacheService } from '@services/cache';

import { TaskStatus } from './model';

export class TaskStatusService {
	private readonly cacheService: CacheService = new CacheService();

	private readonly repo: Repository<TaskStatus> = getManager().getRepository(TaskStatus);

	/**
	 * Read all task status from db
	 *
	 * @param {FindConditions<TaskStatus>} where = {}
	 * @param {boolean} cached = false
	 * @returns {Promise<TaskStatus[]>} Returns array of task status
	 */
	@bind
	public async readTaskStatus(where: FindConditions<TaskStatus> = {}, cached: boolean = false): Promise<TaskStatus[]> {
		try {
			if (Object.keys(where).length) {
				return this.repo.find({
					where
				});
			}

			if (cached) {
				return this.cacheService.get('task-status', this.readTaskStatus);
			}

			return this.repo.find();
		} catch (err) {
			throw new Error(err);
		}
	}
}
