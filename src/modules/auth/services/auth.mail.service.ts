import { User } from '../../user/models/user.model'

import { MailService, MailConfig } from '../../../services/mail.service'

import { variables, env, mails } from '../../../config/globals'

export class AuthMailService extends MailService {
  public async sendRegisterMail(user: User, uuidHash: string) {
    const templateParams = {
      confirmUrl: `${env[variables.env].url}/auth/register/activate/${uuidHash}`
    }

    const mailTemplate = await this.renderMailTemplate(
      './dist/modules/auth/templates/auth.register.html',
      templateParams
    )

    const mail: MailConfig = {
      from: mails.service,
      to: user.email,
      subject: 'Your registration at aionic.app',
      html: mailTemplate
    }

    // send final mail
    return this.sendMail(mail)
  }
}
