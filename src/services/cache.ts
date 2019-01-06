import * as NodeCache from 'node-cache'
import { bind } from 'decko'

export class CacheService {
  private cache: NodeCache

  public constructor() {
    this.cache = new NodeCache({ stdTTL: 100, checkperiod: 120 })
  }

  @bind
  public get(key, storeController, options?: Array<any>) {
    const value = this.cache.get(key)

    if (value) {
      return Promise.resolve(value)
    }

    return storeController.getCachedContent(...options).then(res => {
      this.cache.set(key, res)
      return res
    })
  }

  public set(key, data) {
    this.cache.set(key, data)
  }

  public del(keys) {
    this.cache.del(keys)
  }

  public getStats() {
    return this.cache.getStats()
  }

  public getKeys() {
    return this.cache.keys()
  }

  public flush() {
    this.cache.flushAll()
  }
}
