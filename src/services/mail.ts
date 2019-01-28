import { Data, renderFile } from 'ejs'
import {
  createTransport,
  SendMailOptions,
  SentMessageInfo,
  Transporter,
  TransportOptions
} from 'nodemailer'
import { resolve } from 'path'

import { env } from '@config/globals'

/**
 * MailService
 *
 * Service for sending email
 * Mail services in modules inherits from this one
 */
export abstract class MailService {
  private transporter: Transporter = createTransport(env.SMTP as TransportOptions)

  /**
   * Send email
   *
   * @param {IMailConfig} config
   * @returns {Promise<SentMessageInfo> } Returns info of sent mail
   */
  protected sendMail(config: SendMailOptions): Promise<SentMessageInfo> {
    return this.transporter.sendMail(config)
  }

  /**
   * Render EJS template for Email
   *
   * @param {string} path
   * @param {Data} data
   */
  protected renderMailTemplate(path: string, data: Data): Promise<string> {
    return renderFile(resolve(path), data)
  }
}
