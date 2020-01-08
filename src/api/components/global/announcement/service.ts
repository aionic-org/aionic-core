import { bind } from 'decko';
import { Repository, FindManyOptions, FindOneOptions, getManager } from 'typeorm';

import { IComponentServiceStrict } from '../../index';

import { Announcement } from './model';

export class AnnouncementService implements IComponentServiceStrict<Announcement> {
	readonly defaultRelations: string[] = ['author'];

	readonly repo: Repository<Announcement> = getManager().getRepository(Announcement);

	/**
	 * Read all announcements from db
	 *
	 * @param  options Find options
	 * @returns Returns an array of announcements
	 */
	@bind
	public readAll(options: FindManyOptions<Announcement> = {}): Promise<Announcement[]> {
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
	 * @param options Find options
	 * @returns Returns a single announcement
	 */
	@bind
	public read(options: FindOneOptions<Announcement>): Promise<Announcement | undefined> {
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
	 * @param announcement Announcement to save
	 * @returns Returns saved announcement
	 */
	@bind
	public save(announcement: Announcement): Promise<Announcement> {
		try {
			return this.repo.save(announcement);
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Delete announcement from db
	 *
	 * @param announcement Announcement to delete
	 * @returns Returns deleted announcement
	 */
	@bind
	public async delete(announcement: Announcement): Promise<Announcement> {
		try {
			return this.repo.remove(announcement);
		} catch (err) {
			throw new Error(err);
		}
	}
}
