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
      const comments: TaskComment[] = await this.taskCommentRepo.find({
        relations: ['author'],
        where: {
          task: {
            id: req.params.id
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
      const comment: TaskComment = await this.taskCommentRepo.save({
        author: req.user,
        ...req.body.comment,
        task: { id: req.params.id }
      })

      return res.json({ status: res.statusCode, data: comment })
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
      const comment: TaskComment | undefined = await this.taskCommentRepo.findOne(req.params.id)

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
