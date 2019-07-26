import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

import { User } from '@global/user/model';

import { Task } from '@milestone/task/model';

@Entity()
export class TaskComment {
	/***** columns *****/
	@PrimaryGeneratedColumn()
	public id: number;

	@Column('text')
	public text: string;

	@Column({
		default: true
	})
	public active: boolean;

	@CreateDateColumn()
	public created: Timestamp;

	/***** relations *****/
	@ManyToOne((type) => User, (user) => user.taskComments, { onDelete: 'CASCADE' })
	public author: User;

	@ManyToOne((type) => Task, (task) => task.comments)
	public task: Task;
}
