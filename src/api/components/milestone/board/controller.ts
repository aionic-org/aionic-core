import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { getManager, Repository } from 'typeorm';

import { Board } from './model';

export class BoardController {
	private readonly boardRepo: Repository<Board> = getManager().getRepository('Board');

	/**
	 * Read all boards from db
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async readBoards(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { orderby, orderdir, limit } = req.query;

			let order = {};
			let take: object = {};

			if (orderby || orderdir) {
				order = { order: { [orderby || 'id']: orderdir || 'ASC' } };
			}

			if (limit) {
				take = { take: limit };
			}

			const boards: Board[] = await this.boardRepo.find({
				relations: ['author', 'users'],
				...order,
				...take
			});

			return res.json({ status: res.statusCode, data: boards });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Read a certain board from db
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async readBoard(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { boardID } = req.params;

			if (!boardID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const board: Board | undefined = await this.boardRepo.findOne(boardID, {
				relations: ['author', 'users']
			});

			return res.json({ status: res.statusCode, data: board });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Save new board to db
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async createBoard(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			if (!req.body.board) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const newBoard: Board = await this.boardRepo.save(req.body.board);

			return res.json({ status: res.statusCode, data: newBoard });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Update board in db
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async updateBoard(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { boardID } = req.params;

			if (!boardID || !req.body.board) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const board: Board | undefined = await this.boardRepo.findOne(boardID);

			if (!board) {
				return res.status(404).json({ status: 404, error: 'Board not found' });
			}

			const updatedBoard: Board = await this.boardRepo.save(req.body.board);

			return res.json({ status: res.statusCode, data: updatedBoard });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Delete board from db
	 *
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async deleteBoard(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { boardID } = req.params;

			if (!boardID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const board: Board | undefined = await this.boardRepo.findOne(boardID);

			if (!board) {
				return res.status(404).json({ status: 404, error: 'Board not found' });
			}

			await this.boardRepo.remove(board);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
