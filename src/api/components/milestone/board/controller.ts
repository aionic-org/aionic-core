import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { Board } from './model';
import { BoardService } from './service';
import { FindConditions, In } from 'typeorm';

export class BoardController {
	private readonly service: BoardService = new BoardService();

	/**
	 * Read boards
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readBoards(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { orderby, orderdir, limit, ids } = req.query;

			let where: FindConditions<Board> = {};
			let order = {};
			let take: number = 0;

			if (orderby || orderdir) {
				order = { order: { [orderby || 'id']: orderdir || 'ASC' } };
			}

			if (limit) {
				take = limit;
			}

			if (ids && ids.length) {
				where = { ...where, id: In(ids.split(',')) };
			}

			const boards: Board[] = await this.service.readAll({
				order,
				take,
				where
			});

			return res.json({ status: res.statusCode, data: boards });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Read board
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readBoard(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { boardID } = req.params;

			if (!boardID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const board: Board | undefined = await this.service.read({
				where: {
					id: boardID
				}
			});

			return res.json({ status: res.statusCode, data: board });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Create board
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async createBoard(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			if (!req.body.board) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const newBoard: Board = await this.service.save(req.body.board);

			return res.json({ status: res.statusCode, data: newBoard });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Update board
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async updateBoard(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { boardID } = req.params;

			if (!boardID || !req.body.board) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const board: Board | undefined = await this.service.read({
				where: {
					id: boardID
				}
			});

			if (!board) {
				return res.status(404).json({ status: 404, error: 'Board not found' });
			}

			const updatedBoard: Board = await this.service.save(req.body.board);

			return res.json({ status: res.statusCode, data: updatedBoard });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Delete board
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async deleteBoard(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { boardID } = req.params;

			if (!boardID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const board: Board | undefined = await this.service.read({
				where: {
					id: boardID
				}
			});

			if (!board) {
				return res.status(404).json({ status: 404, error: 'Board not found' });
			}

			await this.service.delete(board);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
