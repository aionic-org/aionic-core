import { bind } from 'decko';
import { Repository, FindConditions, getManager } from 'typeorm';

import { IComponentService } from '../../index';

import { NodeCacheService } from '@services/cache/node-cache';

import { TaskStatus } from './model';

export class TaskStatusService implements IComponentService<TaskStatus> {
	readonly cacheService: NodeCacheService = new NodeCacheService();

	readonly repo: Repository<TaskStatus> = getManager().getRepository(TaskStatus);

	/**
	 * Read all task status from db
	 *
	 * @param where Find conditions
	 * @param cached Read task status from cache
	 * @returns Returns an array of task status
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
