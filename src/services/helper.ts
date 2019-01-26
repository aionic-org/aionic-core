import { compare, genSalt, hash } from 'bcrypt-nodejs'
import * as crypto from 'crypto'
import { v1 as uuidv1 } from 'uuid'

/**
 * - HelperService -
 *
 * Service for helper functions
 */
export class HelperService {
  private readonly saltRounds: number = 10

  /**
   * Hash plain password
   *
   * @param {string} plainPassword
   * @returns {Promise<string>}
   */
  public hashPassword(plainPassword: string): Promise<string> {
    return new Promise((resolve, reject) => {
      genSalt(this.saltRounds, (err, salt) => {
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
   * @returns {Promise<boolean>}
   */
  public verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
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
   * @returns {string}
   */
  public hashString(string: string): string {
    return crypto
      .createHash('sha256')
      .update(string)
      .digest('hex')
  }

  /**
   * Generate uuid
   *
   * @returns {string}
   */
  public generateUuid(): string {
    return uuidv1()
  }
}
