import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { FindManyOptions, getManager, Like, Repository } from 'typeorm'

import { Task } from '@components/task/model'

export class SearchController {
  private readonly taskRepo: Repository<Task> = getManager().getRepository('Task')

  /**
   * Search task by search params
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
      const { searchTerm, status, assignee, author, branch, closed } = req.query

      let where = {}

      if (searchTerm && searchTerm.length) {
        where = { ...where, description: Like(`%${searchTerm}%`) }
      }

      if (status) {
        where = { ...where, status: { id: status } }
      }

      if (assignee) {
        where = { ...where, assignee: { id: assignee } }
      }

      if (author) {
        where = { ...where, author: { id: author } }
      }

      if (branch && branch.length) {
        where = { ...where, branch }
      }

      const tasks: Task[] = await this.taskRepo.find({
        order: {
          updated: 'DESC'
        },
        relations: ['author', 'assignee', 'status', 'priority'],
        where
      })

      return res.json({ status: res.statusCode, data: tasks })
    } catch (err) {
      return next(err)
    }
  }
}
