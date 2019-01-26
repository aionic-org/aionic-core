import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { getManager, Repository } from 'typeorm'

import { Task } from './model'

export class TaskController {
  private readonly taskRepo: Repository<Task> = getManager().getRepository('Task')

  @bind
  public async readTasks(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const tasks: Task[] = await this.taskRepo.find({
        relations: ['author', 'assignee', 'status', 'priority']
      })

      return res.json({ status: res.statusCode, data: tasks })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async readTask(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const task: Task | undefined = await this.taskRepo.findOne(req.params.id, {
        relations: ['author', 'assignee', 'status', 'priority']
      })

      const statusCode = task && task.id ? res.statusCode : 404

      return res.status(statusCode).json({ status: statusCode, data: task })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async createTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const task: Task = await this.taskRepo.save(req.body.task)

      return res.json({ status: res.statusCode, data: task })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async updateTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const task: Task | undefined = await this.taskRepo.findOne(req.params.id)

      // task not found
      if (!task || !task.id) {
        return res.status(404).json({ status: 404, error: 'task not found' })
      }

      // update task
      await this.taskRepo.save(req.body.task)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async deleteTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const task: Task | undefined = await this.taskRepo.findOne(req.params.id)

      if (!task) {
        return res.status(404).json({ status: 404, error: 'task not found' })
      }

      await this.taskRepo.remove(task)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }
}
