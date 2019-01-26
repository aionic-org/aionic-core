import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { getManager, Like, Repository } from 'typeorm'

import { Task } from '../task/model'

export class SearchController {
  private readonly taskRepo: Repository<Task> = getManager().getRepository('Task')

  @bind
  public async searchTaskByDescription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const tasks: Task[] = await this.taskRepo.find({
        relations: ['author', 'assignee', 'status', 'priority'],
        where: {
          description: Like(`%${req.params.searchTerm}%`)
        }
      })

      return res.json({ status: res.statusCode, data: tasks })
    } catch (err) {
      return next(err)
    }
  }
}
