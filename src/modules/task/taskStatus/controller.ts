import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'

import { CacheService } from '../../../services/cache'

import { TaskStatus } from './model'

export class TaskStatusController {
  private readonly cacheService: CacheService = new CacheService()
  private readonly taskStatusRepo: Repository<TaskStatus> = getManager().getRepository('TaskStatus')

  @bind
  public async readTaskStatus(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const status: Array<TaskStatus> = await this.cacheService.get('taskStatus', this, ['ASC'])

      return res.json({ status: res.statusCode, data: status })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * get target content for cache service
   *
   * @param {any} sortOrder
   * @returns {Promise<Array<TaskStatus>>}
   */
  @bind
  private getCachedContent(sortOrder: any): Promise<Array<TaskStatus>> {
    return this.taskStatusRepo.find({ order: { sort: sortOrder } })
  }
}
