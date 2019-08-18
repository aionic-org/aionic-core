import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { getManager, Repository } from 'typeorm';

import { BoardShareMailService } from './services/mail';

import { User } from '@global/user/model';
import { Board } from '@milestone/board/model';

export class BoardShareController {
	private readonly userRepo: Repository<User> = getManager().getRepository('User');
	private readonly boardRepo: Repository<Board> = getManager().getRepository('Board');
	private readonly boardShareMailService: BoardShareMailService = new BoardShareMailService();

	/**
	 * Share a board via email with user
	 *
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

			const boardToShare: Board | undefined = await this.boardRepo.findOne(boardID);

			if (!boardToShare) {
				return res.status(404).json({ status: 404, error: 'Board to share not found' });
			}

			for (const userID of userIDs) {
				const targetUser: User | undefined = await this.userRepo.findOne(userID);

				if (targetUser) {
					await this.boardShareMailService.sendBoard(req.user, targetUser, boardToShare);
				}
			}

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
