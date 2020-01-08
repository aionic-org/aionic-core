import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

import { User } from '@global/user/model';

import { Task } from '@milestone/task/model';

@Entity()
export class TaskScratchpad {
	/***** columns *****/
	@PrimaryGeneratedColumn()
	public id: number;

	@Column('text')
	public text: string;

	@CreateDateColumn()
	public created: Timestamp;

	/***** relations *****/
	@ManyToOne(
		(type) => User,
		(user) => user.taskScratchpads,
		{ onDelete: 'CASCADE' }
	)
	public author: User;

	@ManyToOne(
		(type) => Task,
		(task) => task.scratchpads,
		{ onDelete: 'CASCADE' }
	)
	public task: Task;
}
