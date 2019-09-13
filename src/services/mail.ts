import { Data, renderFile } from 'ejs';
import { createTransport, SendMailOptions, SentMessageInfo, Transporter, TransportOptions } from 'nodemailer';
import { resolve } from 'path';
import { Service } from 'typedi';

import { env } from '@config/globals';
import { logger } from '@config/logger';

/**
 * MailService
 *
 * Service for sending emails
 * Mail services in components inherits from this one
 */
@Service()
export class MailService {
	private transporter: Transporter = createTransport(env.SMTP as TransportOptions);

	/**
	 * Send email
	 *
	 * @param {IMailConfig} config
	 * @param {boolean} forceSend
	 * @returns {Promise<SentMessageInfo> } Returns info of sent mail
	 */
	public sendMail(config: SendMailOptions, forceSend: boolean = false): Promise<SentMessageInfo> | void {
		if (env.NODE_ENV === 'production' || forceSend) {
			return this.transporter.sendMail(config);
		}
		logger.info('Emails are only sent in production mode!');
	}

	/**
	 * Render EJS template for Email
	 *
	 * @param {string} path
	 * @param {Data} data
	 */
	public renderMailTemplate(path: string, data: Data): Promise<string> {
		return renderFile(resolve(path), data);
	}
}
