import { SendMailOptions, SentMessageInfo } from 'nodemailer';

import { apps } from '@config/globals';

import { MailService } from '@services/mail';

export class AuthMailService extends MailService {
	/**
	 * Send user invitation email
	 *
	 * @param {string} email
	 * @param {string} uuid
	 * @returns {Promise<SentMessageInfo>} Returns info of sent mail
	 */
	public async sendUserInvitation(email: string, uuid: string): Promise<SentMessageInfo> {
		const templateParams = {
			confirmUrl: `${apps.milestone.domain}/register/${uuid}?email=${email}`
		};

		const mailTemplate = await this.renderMailTemplate(
			'./dist/api/components/global/user-invitation/templates/user-invitation.html',
			templateParams
		);

		const mail: SendMailOptions = {
			from: apps.milestone.email,
			html: mailTemplate,
			subject: 'You were invited to join Aionic',
			to: email
		};

		// Send final mail
		return this.sendMail(mail);
	}
}
