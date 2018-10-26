import { MailService, MailConfig } from '../../../services/mail'

import { variables, env, mails } from '../../../config/globals'

export class AuthMailService extends MailService {
  public async sendUserInvitation(email: string, name: string, uuid: string) {
    const templateParams = {
      name: name,
      confirmUrl: `${env[variables.env].url}/api/auth/register/${uuid}`
    }

    const mailTemplate = await this.renderMailTemplate(
      './dist/modules/auth/templates/userInvitation.html',
      templateParams
    )

    const mail: MailConfig = {
      from: mails.service,
      to: email,
      subject: 'You were invited to join Aionic',
      html: mailTemplate
    }

    // send final mail
    return this.sendMail(mail)
  }
}
