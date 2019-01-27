import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { getManager, Repository } from 'typeorm'

import { TaskComment } from './model'

export class TaskCommentController {
  private readonly taskCommentRepo: Repository<TaskComment> = getManager().getRepository(
    'TaskComment'
  )

  @bind
  public async readTaskComments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { id } = req.params

      if (!id) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const comments: TaskComment[] = await this.taskCommentRepo.find({
        relations: ['author'],
        where: {
          task: {
            id
          }
        }
      })

      return res.json({ status: res.statusCode, data: comments })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async createTaskComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { id } = req.params

      if (!id || !req.body.comment) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const newComment: TaskComment = await this.taskCommentRepo.save({
        ...req.body.comment,
        author: req.user,
        task: { id }
      })

      return res.json({ status: res.statusCode, data: newComment })
    } catch (err) {
      return next(err)
    }
  }

  @bind
  public async deleteTaskComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { id } = req.params

      if (!id) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const comment: TaskComment | undefined = await this.taskCommentRepo.findOne(id)

      if (!comment) {
        return res.status(404).json({ status: 404, error: 'comment not found' })
      }

      await this.taskCommentRepo.remove(comment)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }
}
