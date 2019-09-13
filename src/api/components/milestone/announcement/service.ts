import { bind } from 'decko';
import { Repository, FindManyOptions, FindOneOptions, getManager } from 'typeorm';

import { Announcement } from './model';

export class AnnouncementService {
	private readonly defaultRelations: string[] = ['author'];

	private readonly repo: Repository<Announcement> = getManager().getRepository(Announcement);

	/**
	 * Read all announcements from db
	 *
	 * @param {FindManyOptions<Announcement>} options = {}
	 * @returns {Promise<Announcement[]>} Returns an array of announcements
	 */
	@bind
	public readAnnouncements(options: FindManyOptions<Announcement> = {}): Promise<Announcement[]> {
		try {
			return this.repo.find({
				relations: this.defaultRelations,
				...options
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Read a certain announcement from db
	 *
	 * @param {FindOneOptions<Announcement>} options = {}
	 * @returns {Promise<Announcement>} Returns a single announcement
	 */
	@bind
	public readAnnouncement(options: FindOneOptions<Announcement>): Promise<Announcement | undefined> {
		try {
			return this.repo.findOne({
				relations: this.defaultRelations,
				...options
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Save new or updated announcement to db
	 *
	 * @param {Announcement} announcement
	 * @returns {Promise<Announcement>} Returns saved announcement
	 */
	@bind
	public saveAnnouncement(announcement: Announcement): Promise<Announcement> {
		try {
			return this.repo.save(announcement);
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Delete announcement from db
	 *
	 * @param {Announcement} announcement
	 * @returns {Promise<Announcement>} Returns deleted announcement
	 */
	@bind
	public async deleteAnnouncement(announcement: Announcement): Promise<Announcement> {
		try {
			return this.repo.remove(announcement);
		} catch (err) {
			throw new Error(err);
		}
	}
}
