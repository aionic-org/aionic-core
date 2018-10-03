import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'

import { TaskPriority } from './taskPriority.model'

export class TaskPriorityController {
  private readonly taskPriorityRepo: Repository<TaskPriority> = getManager().getRepository(
    'TaskPriority'
  )

  @bind
  public async readTaskPriorities(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const taskPriorities: Array<TaskPriority> = await this.taskPriorityRepo.find()

      return res.json({ status: res.statusCode, data: taskPriorities })
    } catch (err) {
      return next(err)
    }
  }
}
