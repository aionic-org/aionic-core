import {
	Column,
	CreateDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	Timestamp,
	UpdateDateColumn
} from 'typeorm';

import { User } from '@global/user/model';

@Entity()
export class Board {
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

	@CreateDateColumn()
	public created: Timestamp;

	@UpdateDateColumn()
	public updated: Timestamp;

	/***** relations *****/
	@ManyToOne(
		(type) => User,
		(user) => user.author
	)
	public author: User;

	@ManyToMany(
		(type) => User,
		(user) => user.boards
	)
	@JoinTable()
	public users: User[];

	public static mockTestBoard(): Board {
		const board: Board = new Board();
		board.id = 1;
		board.title = 'testTitle';
		board.description = 'testDescription';

		return board;
	}
}
