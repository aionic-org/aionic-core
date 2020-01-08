import { bind } from 'decko';
import { Repository, FindManyOptions, FindOneOptions, getManager } from 'typeorm';

import { IComponentServiceStrict } from '../../index';

import { Task } from './model';

export class TaskService implements IComponentServiceStrict<Task> {
	readonly defaultRelations: string[] = [
		'author',
		'assignee',
		'status',
		'priority',
		'project',
		'repository',
		'organization',
		'links',
		'links.author'
	];

	readonly repo: Repository<Task> = getManager().getRepository(Task);

	/**
	 * Read all tasks from db
	 *
	 * @param options Find options
	 * @returns Returns an array of tasks
	 */
	@bind
	public readAll(options: FindManyOptions<Task>): Promise<Task[]> {
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
	 * Read a certain task from db
	 *
	 * @param options Find options
	 * @returns Returns a single task
	 */
	@bind
	public read(options: FindOneOptions<Task>): Promise<Task | undefined> {
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
	 * Save new or updated task to db
	 *
	 * @param task Task to save
	 * @returns Returns saved task
	 */
	@bind
	public save(task: Task): Promise<Task> {
		try {
			return this.repo.save(task);
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Delete task from db
	 *
	 * @param task Task to delete
	 * @returns Returns deleted task
	 */
	@bind
	public async delete(task: Task): Promise<Task> {
		try {
			return this.repo.remove(task);
		} catch (err) {
			throw new Error(err);
		}
	}
}
