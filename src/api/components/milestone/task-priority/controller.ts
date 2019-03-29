import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { getManager, Repository } from 'typeorm'

import { CacheService } from '@services/cache'

import { TaskPriority } from './model'

export class TaskPriorityController {
  private readonly cacheService: CacheService = new CacheService()
  private readonly taskPriorityRepo: Repository<TaskPriority> = getManager().getRepository(
    'TaskPriority'
  )

  /**
   * Read all task priorities from db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async readTaskPriorities(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const taskPriorities: TaskPriority[] = await this.cacheService.get('taskPriority', this)

      return res.json({ status: res.statusCode, data: taskPriorities })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Get target content for cache service
   *
   * @returns {Promise<Array<TaskPriority>>}
   */
  @bind
  private getCachedContent(): Promise<TaskPriority[]> {
    return this.taskPriorityRepo.find()
  }
}
