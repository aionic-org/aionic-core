import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Task } from '@milestone/task/model';

@Entity()
export class TaskPriority {
	/***** columns *****/
	@PrimaryGeneratedColumn()
	public id: number;

	@Column()
	public title: string;

	@Column()
	public value: number;

	/***** relations *****/
	@OneToMany((type) => Task, (task) => task.priority)
	public tasks: Task[];
}
