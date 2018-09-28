import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'

import { TaskBaseController } from './task.base.controller'

import { Task } from '../models/task.model'
import { TaskStatus } from '../models/taskStatus.model'

export class TaskController extends TaskBaseController {
  private readonly statusRepo: Repository<TaskStatus> = getManager().getRepository('TaskStatus')

  @bind
  public async readTaskStatus(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const status: Array<TaskStatus> = await this.statusRepo.find({
        order: {
          order: 'ASC'
        }
      })

      return res.json({ status: res.statusCode, data: status })
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
          user: req.params.userID,
          status: req.params.statusID
        },
        relations: ['author', 'assignee', 'status', 'priority']
      })

      return res.json({ status: res.statusCode, data: tasks })
    } catch (err) {
      return next(err)
    }
  }
}
