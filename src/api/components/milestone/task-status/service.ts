import { bind } from 'decko';
import { Repository, FindConditions, getManager, FindManyOptions, FindOneOptions } from 'typeorm';

import { IComponentServiceStrict } from '../../index';

import { NodeCacheService } from '@services/cache/node-cache';

import { TaskStatus } from './model';

export class TaskStatusService implements IComponentServiceStrict<TaskStatus> {
	readonly cacheService: NodeCacheService = new NodeCacheService();
	readonly cacheName: string = 'task-status';

	readonly repo: Repository<TaskStatus> = getManager().getRepository(TaskStatus);

	/**
	 * Read all task status from db
	 *
	 * @param where Find conditions
	 * @param cached Read task status from cache
	 * @returns Returns an array of task status
	 */
	@bind
	public async readAll(options: FindManyOptions<TaskStatus> = {}, cached: boolean = false): Promise<TaskStatus[]> {
		try {
			if (Object.keys(options).length) {
				return this.repo.find({
					...options
				});
			}

			if (cached) {
				return this.cacheService.get(this.cacheName, this.readAll);
			}

			return this.repo.find();
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Read a certain task-status from db
	 *
	 * @param options Find options
	 * @returns Returns a single task-status
	 */
	@bind
	public read(options: FindOneOptions<TaskStatus> = {}): Promise<TaskStatus | undefined> {
		try {
			return this.repo.findOne(options);
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Save new or updated task-status to db
	 *
	 * @param taskStatus task-status to save
	 * @returns Returns saved task-status
	 */
	@bind
	public async save(taskStatus: TaskStatus): Promise<TaskStatus> {
		try {
			const newTaskStatus: TaskStatus = await this.repo.save(taskStatus);

			// Clear task-status cache
			this.cacheService.delete(this.cacheName);

			return newTaskStatus;
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Delete task-status from db
	 *
	 * @param taskStatus task-status to delete
	 * @returns Returns deleted task-status
	 */
	@bind
	public async delete(taskStatus: TaskStatus): Promise<TaskStatus> {
		try {
			const deletedTaskStatus = await this.repo.remove(taskStatus);

			// Clear task-status cache
			this.cacheService.delete(this.cacheName);

			return deletedTaskStatus;
		} catch (err) {
			throw new Error(err);
		}
	}
}
