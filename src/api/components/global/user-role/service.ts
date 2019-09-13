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
	 * @param {FindConditions<UserRole>} where = {}
	 * @param {boolean} cached = false
	 * @returns {Promise<UserRole[]>} Returns array of user roles
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
				return this.cacheService.get('userRole', this);
			}

			return this.repo.find();
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Get target content for cache service
	 *
	 * @returns {Promise<UserRole[]>}
	 */
	@bind
	private getCachedContent(): Promise<UserRole[]> {
		try {
			return this.repo.find();
		} catch (err) {
			throw new Error(err);
		}
	}
}
