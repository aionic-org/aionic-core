import { bind } from 'decko'
import { NextFunction, Request, Response } from 'express'
import { getManager, Repository } from 'typeorm'

import { Announcement } from './model'

export class AnnouncementController {
  private readonly announcementRepo: Repository<Announcement> = getManager().getRepository(
    'Announcement'
  )

  /**
   * Read all announcements from db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async readAnnouncements(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const announcements: Announcement[] = await this.announcementRepo.find({
        relations: ['author']
      })

      return res.json({ status: res.statusCode, data: announcements })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Read a announcement project from db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async readAnnouncement(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { announcementId } = req.params

      if (!announcementId) {
        return res.status(400).json({ status: 400, error: 'Invalid request' })
      }

      const announcement: Announcement | undefined = await this.announcementRepo.findOne(
        announcementId,
        {
          relations: ['author']
        }
      )

      return res.json({ status: res.statusCode, data: announcement })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Save new announcement to db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async createAnnouncement(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      if (!req.body.announcement) {
        return res.status(400).json({ status: 400, error: 'Invalid request' })
      }

      const newAnnouncement: Announcement = await this.announcementRepo.save(req.body.announcement)

      return res.json({ status: res.statusCode, data: newAnnouncement })
    } catch (err) {
      return next(err)
    }
  }

  /**
   * Delete announcement from db
   *
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Promise<Response | void>} Returns HTTP response
   */
  @bind
  public async deleteAnnouncement(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { announcementId } = req.params

      if (!announcementId) {
        return res.status(400).json({ status: 400, error: 'Invalid request' })
      }

      const announcement: Announcement | undefined = await this.announcementRepo.findOne(
        announcementId
      )

      if (!announcement) {
        return res.status(404).json({ status: 404, error: 'Announcement not found' })
      }

      await this.announcementRepo.remove(announcement)

      return res.status(204).send()
    } catch (err) {
      return next(err)
    }
  }
}
