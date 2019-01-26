import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp
} from 'typeorm'

import { User } from '../../../user/model'
import { Task } from '../../model'

@Entity()
export class TaskComment {
  /***** columns *****/
  @PrimaryGeneratedColumn()
  public id: number

  @Column('text')
  public comment: string

  @Column({
    default: true
  })
  public active: boolean

  @CreateDateColumn()
  public created: Timestamp

  /***** relations *****/
  @ManyToOne(type => User, user => user.comments)
  public author: User

  @ManyToOne(type => Task, task => task.comments)
  public task: Task
}
