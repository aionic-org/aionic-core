import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Timestamp,
  ManyToOne
} from 'typeorm'

import { User } from '../../user/models/user.model'
import { TaskStatus } from './taskStatus.model'
import { TaskPriority } from './taskPriority.model'

@Entity()
export class Task {
  /***** columns *****/
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public title: string

  @Column('text')
  public description: string

  @Column()
  public branch: string

  @CreateDateColumn()
  public created: Timestamp

  @UpdateDateColumn()
  public updated: Timestamp

  /***** relations *****/
  @ManyToOne(type => User, user => user.tasksAuthor)
  public author: User

  @ManyToOne(type => User, user => user.tasksAssignee)
  public assignee: User

  @ManyToOne(type => TaskStatus, taskStatus => taskStatus.tasks)
  public status: TaskStatus

  @ManyToOne(type => TaskPriority, taskPriority => taskPriority.tasks)
  public priority: TaskPriority
}
