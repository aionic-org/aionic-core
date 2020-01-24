import { bind } from 'decko';
import { SendMailOptions } from 'nodemailer';

import { apps, Clients } from '@config/globals';

import { MailService } from '@services/mail';

import { User } from '@global/user/model';
import { Project } from '@milestone/project/model';

export class ProjectShareService {
	private readonly mailService: MailService = new MailService();

	/**
	 * Share a project via email with users
	 *
	 * @param author User who shares project
	 * @param users Users to share project with
	 * @param project Project to share
	 * @returns
	 */
	@bind
	public async shareProject(author: User, users: User[], project: Project): Promise<void> {
		try {
			const mailTemplateUrl = './dist/api/components/milestone/project/templates/project-share.html';
			const mailSubject = `[Aionic-Milestone] ${author.firstname} shared a project with you!`;

			for (const user of users) {
				// Set mail parameters
				const templateParams = {
					userFirstname: user.firstname,
					authorFirstname: author.firstname,
					projectUrl: `${apps[Clients.milestone].domain}/projects/${project.id}`,
					projectName: project.title
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
