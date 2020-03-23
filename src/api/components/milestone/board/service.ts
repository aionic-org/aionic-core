import { bind } from 'decko';
import { Repository, FindManyOptions, FindOneOptions, getManager, In } from 'typeorm';

import { IComponentServiceStrict } from '../../index';

import { Board } from './model';

export class BoardService implements IComponentServiceStrict<Board> {
	readonly defaultRelations: string[] = ['author', 'members'];

	readonly repo: Repository<Board> = getManager().getRepository(Board);

	/**
	 * Read all boards from db
	 *
	 * @param options Find options
	 * @returns Returns an array of boards
	 */
	@bind
	public readAll(options: FindManyOptions<Board>): Promise<Board[]> {
		try {
			return this.repo.find({
				relations: this.defaultRelations,
				...options
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Read a certain board from db
	 *
	 * @param options Find options
	 * @returns Returns a single board
	 */
	@bind
	public read(options: FindOneOptions<Board>): Promise<Board | undefined> {
		try {
			return this.repo.findOne({
				relations: this.defaultRelations,
				...options
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Save new or updated board to db
	 *
	 * @param board Board to save
	 * @returns Returns saved board
	 */
	@bind
	public save(board: Board): Promise<Board> {
		try {
			return this.repo.save(board);
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Delete board from db
	 *
	 * @param board Board to delete
	 * @returns Returns deleted board
	 */
	@bind
	public async delete(board: Board): Promise<Board> {
		try {
			return this.repo.remove(board);
		} catch (err) {
			throw new Error(err);
		}
	}
}
