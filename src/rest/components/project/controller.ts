import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { getManager, Repository } from 'typeorm'

import { Project } from './model'

export class ProjectController {
  private readonly projectRepo: Repository<Project> = getManager().getRepository('Project')

  /**
   * Read all projects from db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async readProjects(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const projects: Project[] = await this.projectRepo.find({
        relations: ['author', 'tasks']
      })

      return res.json({ status: res.statusCode, data: projects })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Read a certain project from db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async readProject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { projectId } = req.params

      if (!projectId) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const project: Project | undefined = await this.projectRepo.findOne(projectId, {
        relations: ['author', 'tasks', 'tasks.priority', 'tasks.author']
      })

      return res.json({ status: res.statusCode, data: project })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Save new project to db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async createProject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      if (!req.body.project) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const newProject: Project = await this.projectRepo.save(req.body.project)

      return res.json({ status: res.statusCode, data: newProject })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Update project in db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async updateProject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { projectId } = req.params

      if (!projectId || !req.body.project) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const project: Project | undefined = await this.projectRepo.findOne(projectId)

      if (!project) {
        return res.status(404).json({ status: 404, error: 'project not found' })
      }

      const updatedProject: Project = await this.projectRepo.save(req.body.project)

      return res.json({ status: res.statusCode, data: updatedProject })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Delete project from db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async deleteProject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { projectId } = req.params

      if (!projectId) {
        return res.status(400).json({ status: 400, error: 'invalid request' })
      }

      const project: Project | undefined = await this.projectRepo.findOne(projectId)

      if (!project) {
        return res.status(404).json({ status: 404, error: 'project not found' })
      }

      await this.projectRepo.remove(project)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }
}
