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

import { Task } from '@components/task/model'
import { User } from '@components/user/model'

@Entity()
export class Project {
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
    default: false
  })
  public finished: boolean

  @CreateDateColumn()
  public created: Timestamp

  @UpdateDateColumn()
  public updated: Timestamp

  /***** relations *****/
  @ManyToOne(type => User, user => user.author)
  public author: User

  @OneToMany(type => Task, task => task.project)
  public tasks: Task[]
}
