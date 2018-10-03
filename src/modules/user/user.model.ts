import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm'

import { UserRole } from './userRole/userRole.model'
import { Task } from '../task/task.model'
import { TaskComment } from '../task/subs/comment/taskComment.model'

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
    default: false
  })
  public active: boolean

  /***** relations *****/
  @OneToMany(type => Task, task => task.author)
  public author: Array<Task>

  @OneToMany(type => Task, task => task.author)
  public assignee: Array<Task>

  @OneToMany(type => TaskComment, taskComment => taskComment.author)
  public comments: Array<TaskComment>

  @ManyToOne(type => UserRole, userRole => userRole.users)
  public userRole: UserRole
}
