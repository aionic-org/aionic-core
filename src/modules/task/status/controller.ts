import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { getManager, Repository } from 'typeorm'

import { CacheService } from '../../../services/cache'

import { TaskStatus } from './model'

export class TaskStatusController {
  private readonly cacheService: CacheService = new CacheService()
  private readonly taskStatusRepo: Repository<TaskStatus> = getManager().getRepository('TaskStatus')

  /**
   * Read all task status from db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async readTaskStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const status: TaskStatus[] = await this.cacheService.get('taskStatus', this, ['ASC'])

      return res.json({ status: res.statusCode, data: status })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Get target content for cache service
   *
   * @param {any} sortOrder
   * @returns {Promise<Array<TaskStatus>>}
   */
  @bind
  private getCachedContent(sortOrder: any): Promise<TaskStatus[]> {
    return this.taskStatusRepo.find({ order: { sort: sortOrder } })
  }
}
