import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';
import { getManager, Repository } from 'typeorm';

import { CacheService } from '@services/cache';

import { TaskType } from './model';

export class TaskTypeController {
  private readonly cacheService: CacheService = new CacheService();
  private readonly taskTypeRepo: Repository<TaskType> = getManager().getRepository('TaskType');

  /**
   * Read all task types from db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async readTaskType(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const status: TaskType[] = await this.cacheService.get('taskType', this, ['ASC']);

      return res.json({ status: res.statusCode, data: status });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Get target content for cache service
   *
   * @param {any} sortOrder
   * @returns {Promise<Array<TaskType>>}
   */
  @bind
  private getCachedContent(sortOrder: any): Promise<TaskType[]> {
    return this.taskTypeRepo.find({ order: { sort: sortOrder } });
  }
}
