import { IMailConfig, MailService } from '../../../services/mail'

import { env, mails } from '../../../config/globals'

export class AuthMailService extends MailService {
  public async sendUserInvitation(email: string, uuid: string) {
    const templateParams = {
      confirmUrl: `${env.HP.DOMAIN}/api/auth/register/${uuid}`
    }

    const mailTemplate = await this.renderMailTemplate(
      './dist/modules/auth/templates/userInvitation.html',
      templateParams
    )

    const mail: IMailConfig = {
      from: mails.service,
      html: mailTemplate,
      subject: 'You were invited to join Aionic',
      to: email
    }

    // Send final mail
    return this.sendMail(mail)
  }
}
