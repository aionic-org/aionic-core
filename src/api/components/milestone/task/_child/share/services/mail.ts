import { SendMailOptions, SentMessageInfo } from 'nodemailer';

import { apps } from '@config/globals';

import { MailService } from '@services/mail';

import { User } from '@global/user/model';
import { Task } from '@milestone/task/model';

export class TaskShareMailService extends MailService {
	/**
	 * Send a task to user
	 *
	 * @param {User} initialUser
	 * @param {User} targetUser
	 * @param {Task} task
	 * @returns {Promise<SentMessageInfo>} Returns info of sent mail
	 */
	public async sendTask(initialUser: User, targetUser: User, task: Task): Promise<SentMessageInfo> {
		const mailTemplateUrl = './dist/api/components/milestone/task/templates/task-share.html';
		const mailSubject = `[Aionic-Milestone] ${initialUser.firstname} shared a task with you!`;

		// Set mail parameters
		const templateParams = {
			targetUserFirstname: targetUser.firstname,
			initialUserFirstname: initialUser.firstname,
			taskUrl: `${apps.milestone.domain}/tasks/${task.id}`,
			taskName: task.title
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
