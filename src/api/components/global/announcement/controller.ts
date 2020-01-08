import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { Announcement } from './model';
import { AnnouncementService } from './service';

export class AnnouncementController {
	private readonly service: AnnouncementService = new AnnouncementService();

	/**
	 * Read announcements
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readAnnouncements(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const announcements: Announcement[] = await this.service.readAll();

			return res.json({ status: res.statusCode, data: announcements });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Read announcement
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readAnnouncement(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { announcementID } = req.params;

			if (!announcementID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const announcement: Announcement | undefined = await this.service.read({
				where: {
					id: announcementID
				}
			});

			return res.json({ status: res.statusCode, data: announcement });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Create announcement
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async createAnnouncement(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			if (!req.body.announcement) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const newAnnouncement: Announcement = await this.service.save(req.body.announcement);

			return res.json({ status: res.statusCode, data: newAnnouncement });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Delete announcement
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async deleteAnnouncement(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { announcementID } = req.params;

			if (!announcementID) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const announcement: Announcement | undefined = await this.service.read({
				where: {
					id: announcementID
				}
			});

			if (!announcement) {
				return res.status(404).json({ status: 404, error: 'Announcement not found' });
			}

			await this.service.delete(announcement);

			return res.status(204).send();
		} catch (err) {
			return next(err);
		}
	}
}
