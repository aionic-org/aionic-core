import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { BoardShareService } from './service';

import { UserService } from '@global/user/service';
import { BoardService } from '@milestone/board/service';

import { User } from '@global/user/model';
import { Board } from '@milestone/board/model';

export class BoardShareController {
	private readonly boardShareService: BoardShareService = new BoardShareService();
	private readonly boardService: BoardService = new BoardService();
	private readonly userService: UserService = new UserService();

	/**
	 * @param {Request} req
	 * @param {Response} res
	 * @param {NextFunction} next
	 * @returns {Promise<Response | void>} Returns HTTP response
	 */
	@bind
	public async shareBoard(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { boardID } = req.params;
			const { userIDs } = req.body;

			if (!boardID || !userIDs) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const boardToShare: Board | undefined = await this.boardService.readBoard({
				where: {
					id: boardID
				}
			});

			if (!boardToShare) {
				return res.status(404).json({ status: 404, error: 'Board to share not found' });
			}

			const users: User[] = [];

			for (const userID of userIDs) {
				const user: User | undefined = await this.userService.readUser({
					where: {
						id: userID
					}
				});

				if (user) {
					users.push(user);
				}
			}

			await this.boardShareService.shareBoard(req.user as User, users, boardToShare);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
