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
      const { id } = req.params

      if (!id) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const task: Task | undefined = await this.taskRepo.findOne(id, {
        relations: ['author', 'assignee', 'status', 'priority']
      })

      return res.json({ status: res.statusCode, data: task })
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
      if (!req.body.task) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const newTask: Task = await this.taskRepo.save(req.body.task)

      return res.json({ status: res.statusCode, data: newTask })
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
      const { id } = req.params

      if (!id || !req.body.task) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const task: Task | undefined = await this.taskRepo.findOne(id)

      if (!task) {
        return res.status(404).json({ status: 404, error: 'task not found' })
      }

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
      const { id } = req.params

      if (!id) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const task: Task | undefined = await this.taskRepo.findOne(id)

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
