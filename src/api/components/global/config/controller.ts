import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { CacheService } from '@services/cache';

export class ConfigController {
  private readonly cacheService: CacheService = new CacheService();

  /**
   * Get cache keys and stats
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async getCache(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const keys = await this.cacheService.getKeys();
      const stats = await this.cacheService.getStats();

      return res.json({ status: res.statusCode, data: { keys, stats } });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Delete complete cache
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async deleteCache(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      await this.cacheService.flush();

      return res.json({ status: res.statusCode, data: 'cache cleared' });
    } catch (err) {
      return next(err);
    }
  }
}
