import { bind } from 'decko';
import { Repository, FindManyOptions, FindOneOptions, getManager } from 'typeorm';

import { Task } from './model';

export class TaskService {
	private readonly defaultRelations: string[] = [
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

	private readonly repo: Repository<Task> = getManager().getRepository(Task);

	/**
	 * Read all tasks from db
	 *
	 * @param {FindManyOptions<Task>} options = {}
	 * @returns {Promise<Task[]>} Returns an array of tasks
	 */
	@bind
	public readTasks(options: FindManyOptions<Task>): Promise<Task[]> {
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
	 * @param {FindOneOptions<Task>} options = {}
	 * @returns {Promise<Task | undefined>} Returns a single task
	 */
	@bind
	public readTask(options: FindOneOptions<Task>): Promise<Task | undefined> {
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
	 * @param {Task} task
	 * @returns {Promise<Task>} Returns saved task
	 */
	@bind
	public saveTask(task: Task): Promise<Task> {
		try {
			return this.repo.save(task);
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Delete task from db
	 *
	 * @param {Task} task
	 * @returns {Promise<Task>} Returns deleted task
	 */
	@bind
	public async deleteTask(task: Task): Promise<Task> {
		try {
			return this.repo.remove(task);
		} catch (err) {
			throw new Error(err);
		}
	}
}
