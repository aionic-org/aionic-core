import * as NodeCache from 'node-cache'

import { env } from '../config/globals'

export class CacheService {
  private static cache: NodeCache = new NodeCache({ stdTTL: env.cacheTTL })

  public get(key, storeController, options?: Array<any>) {
    const value = CacheService.cache.get(key)

    if (value) {
      return Promise.resolve(value)
    }

    return storeController.getCachedContent(...options).then(res => {
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
