import { bind } from 'decko';
import { In } from 'typeorm';

import { Board } from '@milestone/board/model';

import { Task } from '@milestone/task/model';
import { BoardService } from '@milestone/board/service';
import { TaskService } from '@milestone/task/service';

export class BoardTasksService extends BoardService {
	readonly taskService: TaskService = new TaskService();

	/**
	 * Read tasks with board members from db
	 *
	 * @param board Board to read tasks from
	 * @returns Returns board tasks
	 */
	@bind
	public async readBoardTasks(board: Board): Promise<Task[]> {
		try {
			return this.taskService.readAll({
				where: {
					assigneeId: In(board.members),
					completed: false
				}
			});
		} catch (err) {
			throw new Error(err);
		}
	}
}
