import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { User } from '@components/user/model'

@Entity()
export class UserRole {
  /***** columns *****/
  @PrimaryGeneratedColumn()
  public id: number

  @Column({
    nullable: false,
    unique: true
  })
  public name: string

  /***** relations *****/
  @OneToMany(type => User, user => user.userRole)
  public users: User[]
}
