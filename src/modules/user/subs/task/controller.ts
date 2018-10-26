import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'

import { User } from '../../model'
import { Task } from '../../../task/model'

export class UserTaskController {
  private readonly userRepo: Repository<User> = getManager().getRepository('User')
  private readonly taskRepo: Repository<Task> = getManager().getRepository('Task')

  @bind
  public async readUserTasks(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const tasks: Array<Task> = await this.taskRepo.find({
        where: {
          assignee: { id: req.params.id },
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
  ): Promise<any> {
    try {
      const tasks: Array<Task> = await this.taskRepo.find({
        where: {
          assignee: { id: req.params.userID },
          status: { id: req.params.statusID }
        },
        relations: ['author', 'assignee', 'status', 'priority']
      })

      return res.json({ status: res.statusCode, data: tasks })
    } catch (err) {
      return next(err)
    }
  }
}
