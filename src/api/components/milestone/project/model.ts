import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	Timestamp,
	UpdateDateColumn
} from 'typeorm';

import { User } from '@global/user/model';
import { Task } from '@milestone/task/model';
import { ProjectComment } from './_child/comment/model';

@Entity()
export class Project {
	/***** columns *****/
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({
		default: null
	})
	public title: string;

	@Column({
		default: null,
		unique: true
	})
	public key: string;

	@Column({
		default: null,
		type: 'text'
	})
	public description: string;

	@Column({
		default: false
	})
	public completed: boolean;

	@Column({
		default: false
	})
	public isClone: boolean;

	@Column({
		default: null,
		type: 'datetime'
	})
	public deadline: Timestamp;

	@CreateDateColumn()
	public created: Timestamp;

	@UpdateDateColumn()
	public updated: Timestamp;

	/***** relations *****/
	@ManyToOne((type) => User, (user) => user.author)
	public author: User;

	@OneToMany((type) => ProjectComment, (projectComment) => projectComment.project)
	public comments: ProjectComment[];

	@OneToMany((type) => Task, (task) => task.project)
	public tasks: Task[];
}
