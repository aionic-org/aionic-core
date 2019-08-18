import { SendMailOptions, SentMessageInfo } from 'nodemailer';

import { apps } from '@config/globals';

import { MailService } from '@services/mail';

import { User } from '@global/user/model';
import { Board } from '@milestone/board/model';

export class BoardShareMailService extends MailService {
	/**
	 * Send a board to user
	 *
	 * @param {User} initialUser
	 * @param {User} targetUser
	 * @param {Project} project
	 * @returns {Promise<SentMessageInfo>} Returns info of sent mail
	 */
	public async sendBoard(initialUser: User, targetUser: User, board: Board): Promise<SentMessageInfo> {
		const mailTemplateUrl = './dist/api/components/milestone/board/templates/board-share.html';
		const mailSubject = `[Aionic-Milestone] ${initialUser.firstname} shared a board with you!`;

		// Set mail parameters
		const templateParams = {
			targetUserFirstname: targetUser.firstname,
			initialUserFirstname: initialUser.firstname,
			boardUrl: `${apps.milestone.domain}/boards/${board.id}`,
			boardName: board.title
		};

		const mailTemplate = await this.renderMailTemplate(mailTemplateUrl, templateParams);

		const mail: SendMailOptions = {
			from: apps.milestone.email,
			html: mailTemplate,
			subject: mailSubject,
			to: targetUser.email
		};

		// Send final mail
		return this.sendMail(mail, true);
	}
}
