import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn
} from 'typeorm'

import { Task } from '@components/task/model'
import { User } from '@components/user/model'
import { ProjectComment } from './_child/comment/model'

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
  public done: boolean

  @CreateDateColumn()
  public created: Timestamp

  @UpdateDateColumn()
  public updated: Timestamp

  /***** relations *****/
  @ManyToOne(type => User, user => user.author)
  public author: User

  @OneToMany(type => ProjectComment, projectComment => projectComment.project)
  public comments: ProjectComment[]

  @ManyToMany(type => Task, task => task.projects)
  @JoinTable()
  public tasks: Task[]
}
