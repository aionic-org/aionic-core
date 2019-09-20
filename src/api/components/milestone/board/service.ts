import { bind } from 'decko';
import { Repository, FindManyOptions, FindOneOptions, getManager } from 'typeorm';

import { Board } from './model';

export class BoardService {
	private readonly defaultRelations: string[] = ['author', 'users'];

	private readonly repo: Repository<Board> = getManager().getRepository(Board);

	/**
	 * Read all boards from db
	 *
	 * @param options Find options
	 * @returns Returns an array of boards
	 */
	@bind
	public readBoards(options: FindManyOptions<Board>): Promise<Board[]> {
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
	public readBoard(options: FindOneOptions<Board>): Promise<Board | undefined> {
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
	public saveBoard(board: Board): Promise<Board> {
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
	public async deleteBoard(board: Board): Promise<Board> {
		try {
			return this.repo.remove(board);
		} catch (err) {
			throw new Error(err);
		}
	}
}
