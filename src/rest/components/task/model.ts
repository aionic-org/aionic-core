import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn
} from 'typeorm'

import { User } from '@components/user/model'
import { TaskComment } from './_child/comment/model'
import { TaskPriority } from './priority/model'
import { TaskStatus } from './status/model'

@Entity()
export class Task {
  /***** columns *****/
  @PrimaryGeneratedColumn()
  public id: number

  @Column({
    default: null
  })
  public title: string

  @Column({
    default: null,
    type: 'text'
  })
  public description: string

  @Column({
    default: null
  })
  public branch: string

  @Column({
    default: false
  })
  public closed: boolean

  @CreateDateColumn()
  public created: Timestamp

  @UpdateDateColumn()
  public updated: Timestamp

  /***** relations *****/
  @ManyToOne(type => User, user => user.author)
  public author: User

  @ManyToOne(type => User, user => user.assignee)
  public assignee: User

  @ManyToOne(type => TaskStatus, taskStatus => taskStatus.tasks)
  public status: TaskStatus

  @ManyToOne(type => TaskPriority, taskPriority => taskPriority.tasks)
  public priority: TaskPriority

  @OneToMany(type => TaskComment, taskComment => taskComment.task)
  public comments: TaskComment[]
}
