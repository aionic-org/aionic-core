import { bind } from 'decko';
import { Repository, FindConditions, getManager } from 'typeorm';

import { UserInvitation } from './model';

export class UserInvitationService {
	private readonly repo: Repository<UserInvitation> = getManager().getRepository(UserInvitation);

	/**
	 * Read all user invitations from db
	 *
	 * @param {FindConditions<UserInvitation>} where = {}
	 * @returns {Promise<UserInvitation[]>} Returns array of user invitations
	 */
	@bind
	public readUserInvitations(where: FindConditions<UserInvitation> = {}): Promise<UserInvitation[]> {
		try {
			return this.repo.find({ where });
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Read a certain user invitation from db
	 *
	 * @param {FindConditions<UserInvitation>} where = {}
	 * @returns {Promise<UserInvitation>} Returns a single user invitation
	 */
	@bind
	public readUserInvitation(where: FindConditions<UserInvitation>): Promise<UserInvitation | undefined> {
		try {
			return this.repo.findOne({
				where
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Save new or updated user invitation to db
	 *
	 * @param {UserInvitation} userInvitation
	 * @returns {Promise<User>} Returns saved user invitation
	 */
	@bind
	public saveUserInvitation(userInvitation: UserInvitation): Promise<UserInvitation> {
		try {
			return this.repo.save(userInvitation);
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Delete user invitation from db
	 *
	 * @param {User} user
	 * @returns {Promise<User>} Returns deleted user invitation
	 */
	@bind
	public async deleteUserInvitation(userInvitation: UserInvitation): Promise<UserInvitation> {
		try {
			return this.repo.remove(userInvitation);
		} catch (err) {
			throw new Error(err);
		}
	}
}
