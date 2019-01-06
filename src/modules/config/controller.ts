import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'

import { CacheService } from '../../services/cache'

export class ConfigController {
  private readonly cacheService: CacheService = new CacheService()

  @bind
  public async getCache(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const keys = await this.cacheService.getKeys()
      const stats = await this.cacheService.getStats()

      return res.json({ status: res.statusCode, data: { keys: keys, stats: stats } })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async deleteCache(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      await this.cacheService.flush()

      return res.json({ status: res.statusCode, data: 'cache cleared' })
    } catch (err) {
      return next(err)
    }
  }
}
