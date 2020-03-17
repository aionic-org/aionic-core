import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Task } from '@milestone/task/model';

@Entity()
export class TaskStatus {
	/***** columns *****/
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public title: string;

	@Column()
	public sort: number;

	@Column()
	public max: number;

	@Column()
	public color: string;

	/***** relations *****/
	@OneToMany(
		(type) => Task,
		(task) => task.status
	)
	public tasks: Task[];
}
