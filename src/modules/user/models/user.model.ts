import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'

import { UserRole } from './userRole.model'
import { Task } from '../../task/models/task.model'

@Entity()
export class User {
  /***** columns *****/
  @PrimaryGeneratedColumn()
  public id: number

  @Column({
    unique: true,
    nullable: false
  })
  public email: string

  @Column()
  public firstname: string

  @Column()
  public lastname: string

  @Column({
    select: false
  })
  public password: string

  @Column({
    type: 'tinyint',
    default: false
  })
  public active: boolean

  /***** relations *****/
  @OneToMany(type => Task, task => task.author)
  public articlesAuthor: Array<Task>

  @OneToMany(type => Task, task => task.author)
  public articlesAssignee: Array<Task>

  @ManyToOne(type => UserRole, userRole => userRole.users)
  public userRole: UserRole
}
