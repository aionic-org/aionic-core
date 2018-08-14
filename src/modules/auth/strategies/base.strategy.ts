import { Repository, getManager } from 'typeorm'
import { Strategy as Strategy_Jwt } from 'passport-jwt'
import { BasicStrategy as Strategy_Basic } from 'passport-http'

// models import
import { User } from '../../user/models/user.model'

import { permissions } from '../../../config/permissions'

/**
 *
 * - BaseStrategy -
 *
 * Abstract strategy class
 * Other strategies inherits from this one
 *
 */
export abstract class BaseStrategy {
  protected readonly userRepo: Repository<User> = getManager().getRepository('User')
  protected _strategy: Strategy_Jwt | Strategy_Basic

  public get strategy(): Strategy_Jwt | Strategy_Basic {
    return this._strategy
  }

  /**
   * sets user permission from acl
   *
   * @param {User} user
   * @returns {Promise<void>}
   */
  protected async setPermissions(user: User): Promise<void> {
    // remove all roles
    await permissions.removeUserRoles(user.id, await permissions.userRoles(user.id))

    // add role from db
    await permissions.addUserRoles(user.id, user.userRole.name || 'User')
  }
}
