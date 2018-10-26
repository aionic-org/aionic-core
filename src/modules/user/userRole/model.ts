import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'

import { User } from '../model'

@Entity()
export class UserRole {
  /***** columns *****/
  @PrimaryGeneratedColumn()
  public id: number

  @Column({
    unique: true,
    nullable: false
  })
  public name: string

  /***** relations *****/
  @OneToMany(type => User, user => user.userRole)
  public users: Array<User>
}
