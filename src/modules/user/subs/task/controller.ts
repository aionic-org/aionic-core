import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { getManager, Repository } from 'typeorm'

import { Task } from '../../../task/model'

export class UserTaskController {
  private readonly taskRepo: Repository<Task> = getManager().getRepository('Task')

  @bind
  public async readUserTasks(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { id } = req.params

      if (!id) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const tasks: Task[] = await this.taskRepo.find({
        where: {
          assignee: { id },
          relations: ['author', 'status', 'priority']
        }
      })

      return res.json({ status: res.statusCode, data: tasks })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async readUserTasksByStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { userId, statusId } = req.params

      if (!userId || !statusId) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const tasks: Task[] = await this.taskRepo.find({
        order: {
          priority: 'DESC'
        },
        relations: ['author', 'assignee', 'status', 'priority'],
        where: {
          assignee: { id: userId },
          status: { id: statusId }
        }
      })

      return res.json({ status: res.statusCode, data: tasks })
    } catch (err) {
      return next(err)
    }
  }
}
