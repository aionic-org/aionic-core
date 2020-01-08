import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { User } from '@global/user/model';

@Entity()
export class UserRole {
	/***** columns *****/
	@PrimaryGeneratedColumn()
	public id: number;

	@Column({
		nullable: false,
		unique: true
	})
	public name: string;

	/***** relations *****/
	@OneToMany(
		(type) => User,
		(user) => user.userRole
	)
	public users: User[];

	public static mockTestUserRole(): UserRole {
		const userRole: UserRole = new UserRole();

		userRole.id = 1;
		userRole.name = 'Admin';

		return userRole;
	}
}
