import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'

import { CacheService } from '../../../services/cache'

import { TaskPriority } from './model'

export class TaskPriorityController {
  private readonly cacheService: CacheService = new CacheService()
  private readonly taskPriorityRepo: Repository<TaskPriority> = getManager().getRepository(
    'TaskPriority'
  )

  @bind
  public async readTaskPriorities(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const taskPriorities: Array<TaskPriority> = await this.cacheService.get('taskPriority', this)

      return res.json({ status: res.statusCode, data: taskPriorities })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * get target content for cache service
   *
   * @returns {Promise<Array<TaskPriority>>}
   */
  @bind
  private getCachedContent(): Promise<Array<TaskPriority>> {
    return this.taskPriorityRepo.find()
  }
}
