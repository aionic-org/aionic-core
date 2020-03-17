import { bind } from 'decko';

import { User } from '../../model';
import { Task } from '@milestone/task/model';
import { UserService } from '@global/user/service';

export class UserTaskService extends UserService {
	/**
	 * Read a certain user from db
	 *
	 * @param options Find options
	 * @returns Returns a single user
	 */
	@bind
	public readUserTasks(user: User): Promise<Task[]> {
		try {
			return this.taskService.readAll({
				order: {
					priority: 'DESC'
				},
				where: {
					assignee: user,
					completed: false
				}
			});
		} catch (err) {
			throw new Error(err);
		}
	}
}
