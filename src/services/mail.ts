import { Data, renderFile } from 'ejs'
import { createTransport, Transporter, TransportOptions } from 'nodemailer'
import { resolve } from 'path'

import { env } from '../config/globals'

export interface IMailConfig {
  from: string
  to: string
  subject: string
  html: string
}

/**
 * MailService
 *
 * Service for sending email
 * Module mail services inherits from this one
 */
export abstract class MailService {
  private transporter: Transporter = createTransport(env.SMTP as TransportOptions)

  /**
   * Set email
   *
   * @param {IMailConfig} config
   */
  protected sendMail(config: IMailConfig) {
    return this.transporter.sendMail(config)
  }

  /**
   * Render mail EJS template
   *
   * @param {string} path
   * @param {Data} data
   */
  protected renderMailTemplate(path: string, data: Data): Promise<string> {
    return renderFile(resolve(path), data)
  }
}
