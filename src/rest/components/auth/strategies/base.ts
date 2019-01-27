import { BasicStrategy as Strategy_Basic } from 'passport-http'
import { Strategy as Strategy_Jwt } from 'passport-jwt'
import { getManager, Repository } from 'typeorm'

import { User } from '../../user/model'

import { permissions } from '../../../../config/permissions'

/**
 * Abstract BaseStrategy
 *
 * Other strategies inherits from this one
 */
export abstract class BaseStrategy {
  protected readonly userRepo: Repository<User> = getManager().getRepository('User')
  protected _strategy: Strategy_Jwt | Strategy_Basic

  /**
   * Get strategy
   *
   * @returns {Strategy_Jwt | Strategy_Basic} Returns Passport strategy
   */
  public get strategy(): Strategy_Jwt | Strategy_Basic {
    return this._strategy
  }

  /**
   * Sets acl user permission
   *
   * @param {User} user
   * @returns {Promise<void>}
   */
  protected async setPermissions(user: User): Promise<void> {
    // add role from db
    await permissions.addUserRoles(user.id, user.userRole.name)
  }
}
