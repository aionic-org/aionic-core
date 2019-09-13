import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	Timestamp,
	UpdateDateColumn
} from 'typeorm';

import { User } from '@global/user/model';

import { GitOrganization } from '@milestone/git/_child/organization/model';
import { GitRepository } from '@milestone/git/_child/repository/model';
import { Project } from '@milestone/project/model';
import { TaskPriority } from '@milestone/task-priority/model';
import { TaskStatus } from '@milestone/task-status/model';
import { TaskComment } from './_child/comment/model';
import { TaskScratchpad } from './_child/scratchpad/model';

@Entity()
export class Task {
	/***** columns *****/
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({
		default: null
	})
	public title: string;

	@Column({
		default: null,
		type: 'text'
	})
	public description: string;

	@Column({
		default: null
	})
	public branch: string;

	@Column({
		default: null
	})
	public label: string;

	@Column({
		default: null,
		type: 'text'
	})
	public tags: string;

	@Column({
		default: false
	})
	public completed: boolean;

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
	@ManyToOne((type) => User, (user) => user.author, { onDelete: 'SET NULL' })
	public author: User;

	@ManyToOne((type) => User, (user) => user.assignee, { onDelete: 'SET NULL' })
	public assignee: User;

	@ManyToOne((type) => TaskStatus, (taskStatus) => taskStatus.tasks)
	public status: TaskStatus;

	@ManyToOne((type) => TaskPriority, (taskPriority) => taskPriority.tasks)
	public priority: TaskPriority;

	@OneToMany((type) => TaskComment, (taskComment) => taskComment.task)
	public comments: TaskComment[];

	@OneToMany((type) => TaskScratchpad, (taskScratchpad) => taskScratchpad.task)
	public scratchpads: TaskScratchpad[];

	@ManyToOne((type) => GitOrganization, (gitOrganization) => gitOrganization.tasks, {
		onDelete: 'SET NULL'
	})
	public organization: GitOrganization;

	@ManyToOne((type) => GitRepository, (gitRepository) => gitRepository.tasks, {
		onDelete: 'SET NULL'
	})
	public repository: GitRepository;

	@ManyToOne((type) => Project, (project) => project.tasks)
	public project: Project[];

	@ManyToMany((type) => Task)
	@JoinTable()
	public links: Task[];
}
