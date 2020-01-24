import { bind } from 'decko';
import { SendMailOptions } from 'nodemailer';

import { apps, Clients } from '@config/globals';

import { MailService } from '@services/mail';

import { User } from '@global/user/model';
import { Task } from '@milestone/task/model';

export class TaskShareService {
	private readonly mailService: MailService = new MailService();

	/**
	 * Share a task via email with users
	 *
	 * @param author User who shares task
	 * @param users Users to share tasks with
	 * @param task Task to share
	 * @returns
	 */
	@bind
	public async shareTask(author: User, users: User[], task: Task): Promise<void> {
		try {
			const mailTemplateUrl = './dist/api/components/milestone/task/templates/task-share.html';
			const mailSubject = `[Aionic-Milestone] ${author.firstname} shared a task with you!`;

			for (const user of users) {
				// Set mail parameters
				const templateParams = {
					userFirstname: user.firstname,
					authorFirstname: author.firstname,
					taskUrl: `${apps[Clients.milestone].domain}/tasks/${task.id}`,
					taskName: task.title
				};

				const mailTemplate = await this.mailService.renderMailTemplate(mailTemplateUrl, templateParams);

				const mail: SendMailOptions = {
					from: apps[Clients.milestone].email,
					html: mailTemplate,
					subject: mailSubject,
					to: user.email
				};

				// Send final mail
				this.mailService.sendMail(mail, true);
			}
		} catch (err) {
			throw new Error(err);
		}
	}
}
