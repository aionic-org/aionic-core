import { bind } from 'decko';
import { Repository, FindConditions, getManager } from 'typeorm';

import { CacheService } from '@services/cache';

import { UserRole } from './model';

export class UserRoleService {
	private readonly cacheService: CacheService = new CacheService();

	private readonly repo: Repository<UserRole> = getManager().getRepository(UserRole);

	/**
	 * Read all user roles from db
	 *
	 * @param where Find conditions
	 * @param cached Read user roles from cache
	 * @returns Returns an array of user roles
	 */
	@bind
	public readUserRoles(where: FindConditions<UserRole> = {}, cached: boolean = false): Promise<UserRole[]> {
		try {
			if (Object.keys(where).length) {
				return this.repo.find({
					where
				});
			}

			if (cached) {
				return this.cacheService.get('user-roles', this.readUserRoles);
			}

			return this.repo.find();
		} catch (err) {
			throw new Error(err);
		}
	}
}
