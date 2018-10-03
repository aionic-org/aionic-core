import { bind } from 'decko'
import { Request, Response, NextFunction } from 'express'
import { Repository, getManager } from 'typeorm'

import { TaskComment } from './taskComment.model'

export class TaskCommentController {
  private readonly taskCommentRepo: Repository<TaskComment> = getManager().getRepository(
    'TaskComment'
  )

  @bind
  public async readTaskComments(req: Request, res: Response, next: NextFunction): Promise<any> {
    try {
      const comments: Array<TaskComment> = await this.taskCommentRepo.find({
        where: {
          task: {
            id: req.params.id
          }
        },
        relations: ['author']
      })

      return res.json({ status: res.statusCode, data: comments })
    } catch (err) {
      return next(err)
    }
  }
}
