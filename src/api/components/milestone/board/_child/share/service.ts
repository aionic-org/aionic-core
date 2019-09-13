import { bind } from 'decko';
import { SendMailOptions } from 'nodemailer';

import { apps } from '@config/globals';

import { MailService } from '@services/mail';

import { User } from '@global/user/model';
import { Board } from '@milestone/board/model';

export class BoardShareService {
	private readonly mailService: MailService = new MailService();

	/**
	 * Share a board via email with users
	 *
	 * @param {User} author
	 * @param {User} users
	 * @param {Project} project
	 * @returns {Promise<void>}
	 */
	@bind
	public async shareBoard(author: User, users: User[], board: Board): Promise<void> {
		const mailTemplateUrl = './dist/api/components/milestone/board/templates/board-share.html';
		const mailSubject = `[Aionic-Milestone] ${author.firstname} shared a board with you!`;

		for (const user of users) {
			// Set mail parameters
			const templateParams = {
				userFirstname: user.firstname,
				authorFirstname: author.firstname,
				boardUrl: `${apps.milestone.domain}/boards/${board.id}`,
				boardName: board.title
			};

			const mailTemplate = await this.mailService.renderMailTemplate(mailTemplateUrl, templateParams);

			const mail: SendMailOptions = {
				from: apps.milestone.email,
				html: mailTemplate,
				subject: mailSubject,
				to: user.email
			};

			// Send final mail
			this.mailService.sendMail(mail, true);
		}
	}
}
