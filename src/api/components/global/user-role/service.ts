import { bind } from 'decko';
import { Repository, FindConditions, getManager, FindOneOptions } from 'typeorm';

import { IComponentService } from '../../index';

import { NodeCacheService } from '@services/cache/node-cache';

import { UserRole } from './model';

export class UserRoleService implements IComponentService<UserRole> {
	readonly cacheService: NodeCacheService = new NodeCacheService();

	readonly repo: Repository<UserRole> = getManager().getRepository(UserRole);

	/**
	 * Read all user roles from db
	 *
	 * @param where Find conditions
	 * @param cached Read user roles from cache
	 * @returns Returns an array of user roles
	 */
	@bind
	public readAll(where: FindConditions<UserRole> = {}, cached: boolean = false): Promise<UserRole[]> {
		try {
			if (Object.keys(where).length) {
				return this.repo.find({
					where
				});
			}

			if (cached) {
				return this.cacheService.get('user-roles', this.readAll);
			}

			return this.repo.find();
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Read a certain user from db
	 *
	 * @param options Find options
	 * @returns Returns a single user
	 */
	@bind
	public read(options: FindOneOptions<UserRole> = {}): Promise<UserRole | undefined> {
		try {
			return this.repo.findOne(options);
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Save new or updated user-role to db
	 *
	 * @param user User-role to save
	 * @returns Returns saved user-role
	 */
	@bind
	public async save(userRole: UserRole): Promise<UserRole> {
		try {
			const newUserRole: UserRole = await this.repo.save(userRole);

			// Clear user cache
			this.cacheService.delete('user-roles');

			return newUserRole;
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Read admin user-role from from db
	 *
	 * @returns Returns admin user-role
	 */
	@bind
	public readAdminUserRole(): Promise<UserRole | undefined> {
		try {
			return this.repo.findOne({
				where: {
					name: 'Admin'
				}
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Read user user-role from from db
	 *
	 * @returns Returns user user-role
	 */
	@bind
	public readUserUserRole(): Promise<UserRole | undefined> {
		try {
			return this.repo.findOne({
				where: {
					name: 'User'
				}
			});
		} catch (err) {
			throw new Error(err);
		}
	}
}
