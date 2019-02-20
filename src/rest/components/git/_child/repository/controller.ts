import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { getManager, Repository } from 'typeorm'

import { GitRepository } from './model'

export class GitRepositoryController {
  private readonly gitRepositoryRepo: Repository<GitRepository> = getManager().getRepository(
    'GitRepository'
  )

  /**
   * Read all git organization repositories from db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async readGitOrgRepos(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { orgId } = req.params

      if (!orgId) {
        return res.status(400).json({ status: 400, error: 'Invalid request' })
      }

      const organizations: GitRepository[] = await this.gitRepositoryRepo.find({
        where: {
          organization: {
            id: orgId
          }
        }
      })

      return res.json({ status: res.statusCode, data: organizations })
    } catch (err) {
      return next(err)
    }
  }
}
