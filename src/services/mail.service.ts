import { createTransport, Transporter } from 'nodemailer'
import { renderFile, Data } from 'ejs'
import { resolve } from 'path'

import { smtp } from '../config/globals'

export interface MailConfig {
  from: string
  to: string
  subject: string
  html: string
}

/**
 *
 * - MailService -
 *
 * Service for sending email
 * Module mail services inherits from this one
 *
 */
export abstract class MailService {
  private transporter: Transporter = createTransport(smtp)

  protected sendMail(config: MailConfig) {
    return this.transporter.sendMail(config)
  }

  protected renderMailTemplate(path: string, data: Data): Promise<string> {
    return renderFile(resolve(path), data)
  }
}
