import { compare, genSalt, hash } from 'bcrypt-nodejs'
import * as crypto from 'crypto'
import { v1 as uuidv1 } from 'uuid'

import { logger } from '@config/logger'

/**
 * UtilityService
 *
 * Service for utility functions
 */
export class UtilityService {
  /**
   * Error handler
   *
   * @param {Error} err
   * @returns {void}
   */
  public static handleError(err: Error): void {
    logger.error(err)
  }

  /**
   * Hash plain password
   *
   * @param {string} plainPassword
   * @returns {Promise<string>}
   */
  public static hashPassword(plainPassword: string): Promise<string> {
    return new Promise((resolve, reject) => {
      genSalt(10, (err, salt) => {
        if (err) {
          reject(err)
        }

        hash(
          plainPassword,
          salt,
          () => {
            // just leave this empty
          },
          (error, hashedVal) => {
            if (error) {
              reject(error)
            }

            resolve(hashedVal)
          }
        )
      })
    })
  }

  /**
   * Compares plain password with hashed password
   *
   * @param {string} plainPassword
   * @param {string} hashedPassword
   * @returns {Promise<boolean>} Returns if passwords match
   */
  public static verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      compare(plainPassword, hashedPassword, (err, res) => {
        if (err) {
          reject(err)
        }
        resolve(res)
      })
    })
  }

  /**
   * Hash string with sha256 algorithm - don't use for passwords
   *
   * @param {string} string
   * @returns {string} Returns hashed string
   */
  public static hashString(string: string): string {
    return crypto
      .createHash('sha256')
      .update(string)
      .digest('hex')
  }

  /**
   * Generate uuid
   *
   * @returns {string} Returns UUID
   */
  public static generateUuid(): string {
    return uuidv1()
  }
}
