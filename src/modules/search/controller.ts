import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager, Like } from 'typeorm'

import { Task } from '../task/model'

export class SearchController {
  private readonly taskRepo: Repository<Task> = getManager().getRepository('Task')

  @bind
  public async searchTaskByDescription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> {
    try {
      const tasks: Array<Task> = await this.taskRepo.find({
        where: {
          description: Like(`%${req.params.searchTerm}%`)
        },
        relations: ['author', 'assignee', 'status', 'priority']
      })

      return res.json({ status: res.statusCode, data: tasks })
    } catch (err) {
      return next(err)
    }
  }
}
