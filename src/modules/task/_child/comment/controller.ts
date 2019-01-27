import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { getManager, Repository } from 'typeorm'

import { TaskComment } from './model'

export class TaskCommentController {
  private readonly taskCommentRepo: Repository<TaskComment> = getManager().getRepository(
    'TaskComment'
  )

  /**
   * Read all comments from a certain task from db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>}  Returns HTTP response
   */
  @bind
  public async readTaskComments(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { taskId } = req.params

      if (!taskId) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const comments: TaskComment[] = await this.taskCommentRepo.find({
        relations: ['author'],
        where: {
          task: {
            id: taskId
          }
        }
      })

      return res.json({ status: res.statusCode, data: comments })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Save new task comment to db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>}  Returns HTTP response
   */
  @bind
  public async createTaskComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { taskId } = req.params

      if (!taskId || !req.body.comment) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const newComment: TaskComment = await this.taskCommentRepo.save({
        ...req.body.comment,
        author: req.user,
        task: { id: taskId }
      })

      return res.json({ status: res.statusCode, data: newComment })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Delete task comment from db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>}  Returns HTTP response
   */
  @bind
  public async deleteTaskComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { taskId, commentId } = req.params

      if (!taskId || !commentId) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const comment: TaskComment | undefined = await this.taskCommentRepo.findOne({
        where: {
          id: commentId,
          task: {
            id: taskId
          }
        }
      })

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
