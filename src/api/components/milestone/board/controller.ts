import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { Board } from './model';
import { BoardService } from './service';

export class BoardController {
	private readonly service: BoardService = new BoardService();

	/**
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

			const boards: Board[] = await this.service.readBoards({
				...order,
				...take
			});

			return res.json({ status: res.statusCode, data: boards });
		} catch (err) {
			return next(err);
		}
	}

	/**
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

			const board: Board | undefined = await this.service.readBoard({
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

			const newBoard: Board = await this.service.saveBoard(req.body.board);

			return res.json({ status: res.statusCode, data: newBoard });
		} catch (err) {
			return next(err);
		}
	}

	/**
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

			const board: Board | undefined = await this.service.readBoard({
				where: {
					id: boardID
				}
			});

			if (!board) {
				return res.status(404).json({ status: 404, error: 'Board not found' });
			}

			const updatedBoard: Board = await this.service.saveBoard(req.body.board);

			return res.json({ status: res.statusCode, data: updatedBoard });
		} catch (err) {
			return next(err);
		}
	}

	/**
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

			const board: Board | undefined = await this.service.readBoard({
				where: {
					id: boardID
				}
			});

			if (!board) {
				return res.status(404).json({ status: 404, error: 'Board not found' });
			}

			await this.service.deleteBoard(board);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
