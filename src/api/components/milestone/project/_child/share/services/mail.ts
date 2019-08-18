import { SendMailOptions, SentMessageInfo } from 'nodemailer';

import { apps } from '@config/globals';

import { MailService } from '@services/mail';

import { User } from '@global/user/model';
import { Project } from '@milestone/project/model';

export class ProjectShareMailService extends MailService {
	/**
	 * Send a project to user
	 *
	 * @param {User} initialUser
	 * @param {User} targetUser
	 * @param {Project} project
	 * @returns {Promise<SentMessageInfo>} Returns info of sent mail
	 */
	public async sendProject(initialUser: User, targetUser: User, project: Project): Promise<SentMessageInfo> {
		const mailTemplateUrl = './dist/api/components/milestone/project/templates/project-share.html';
		const mailSubject = `[Aionic-Milestone] ${initialUser.firstname} shared a project with you!`;

		// Set mail parameters
		const templateParams = {
			targetUserFirstname: targetUser.firstname,
			initialUserFirstname: initialUser.firstname,
			projectUrl: `${apps.milestone.domain}/projects/${project.id}`,
			projectName: project.title
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
