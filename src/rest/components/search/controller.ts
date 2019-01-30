import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { getManager, Like, Repository } from 'typeorm'

import { Task } from '@components/task/model'

export class SearchController {
  private readonly taskRepo: Repository<Task> = getManager().getRepository('Task')

  /**
   * Search task by description search term
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async searchTaskByDescription(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { searchTerm } = req.params

      if (!searchTerm) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const tasks: Task[] = await this.taskRepo.find({
        order: {
          updated: 'DESC'
        },
        relations: ['author', 'assignee', 'status', 'priority'],
        where: {
          description: Like(`%${searchTerm}%`)
        }
      })

      return res.json({ status: res.statusCode, data: tasks })
    } catch (err) {
      return next(err)
    }
  }
}
