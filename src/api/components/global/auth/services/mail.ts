import { SendMailOptions, SentMessageInfo } from 'nodemailer';

import { env, mails } from '@config/globals';

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
			confirmUrl: `${env.HP.DOMAIN}/register/${uuid}?email=${email}`
		};

		const mailTemplate = await this.renderMailTemplate(
			'./dist/rest/components/auth/templates/userInvitation.html',
			templateParams
		);

		const mail: SendMailOptions = {
			from: mails.service,
			html: mailTemplate,
			subject: 'You were invited to join Aionic',
			to: email
		};

		// Send final mail
		return this.sendMail(mail);
	}
}
