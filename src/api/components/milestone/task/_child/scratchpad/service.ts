import { bind } from 'decko';
import { Repository, FindConditions, getManager } from 'typeorm';

import { TaskScratchpad } from './model';

export class TaskScratchpadService {
	private readonly repo: Repository<TaskScratchpad> = getManager().getRepository(TaskScratchpad);

	/**
	 * Read a certain task scratchpad from db
	 *
	 * @param {FindConditions<TaskScratchpad>} where = {}
	 * @returns {Promise<TaskScratchpad | undefined>} Returns an single task scratchpad
	 */
	@bind
	public readTaskScratchpad(where: FindConditions<TaskScratchpad> = {}): Promise<TaskScratchpad | undefined> {
		return this.repo.findOne({
			where
		});
	}

	/**
	 * Save new or updated task scratchpad to db
	 *
	 * @param {TaskScratchpad} taskScratchpad
	 * @returns {Promise<TaskScratchpad>} Returns saved task scratchpad
	 */
	@bind
	public saveTaskScratchpad(taskScratchpad: TaskScratchpad): Promise<TaskScratchpad> {
		try {
			return this.repo.save(taskScratchpad);
		} catch (err) {
			throw new Error(err);
		}
	}
}
