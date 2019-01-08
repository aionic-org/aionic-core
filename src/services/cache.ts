import * as NodeCache from 'node-cache'

import { env } from '../config/globals'

export class CacheService {
  private static cache: NodeCache = new NodeCache({ stdTTL: env.cacheTTL })

  /**
   * compares plain password with hashed password
   *
   * @param {string} key
   * @param {object} storeController
   * @param {object} params
   * @returns {Promise<any>}
   */
  public get(key, storeController, params?: Array<any>): Promise<any> {
    const value = CacheService.cache.get(key)

    if (value) {
      return Promise.resolve(value)
    }

    return storeController.getCachedContent(...params).then(res => {
      CacheService.cache.set(key, res)
      return res
    })
  }

  public set(key, data) {
    CacheService.cache.set(key, data)
  }

  public delete(keys) {
    CacheService.cache.del(keys)
  }

  public getStats() {
    return CacheService.cache.getStats()
  }

  public getKeys() {
    return CacheService.cache.keys()
  }

  public flush() {
    CacheService.cache.flushAll()
  }
}
