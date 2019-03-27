import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn
} from 'typeorm'

import { GitOrganization } from '@components/git/_child/organization/model'
import { GitRepository } from '@components/git/_child/repository/model'
import { Project } from '@components/project/model'
import { TaskPriority } from '@components/task-priority/model'
import { TaskStatus } from '@components/task-status/model'
import { User } from '@components/user/model'
import { TaskComment } from './_child/comment/model'

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
  @ManyToOne(type => User, user => user.author, { onDelete: 'SET NULL' })
  public author: User

  @ManyToOne(type => User, user => user.assignee, { onDelete: 'SET NULL' })
  public assignee: User

  @ManyToOne(type => TaskStatus, taskStatus => taskStatus.tasks)
  public status: TaskStatus

  @ManyToOne(type => TaskPriority, taskPriority => taskPriority.tasks)
  public priority: TaskPriority

  @OneToMany(type => TaskComment, taskComment => taskComment.task)
  public comments: TaskComment[]

  @ManyToOne(type => GitOrganization, gitOrganization => gitOrganization.tasks, {
    onDelete: 'SET NULL'
  })
  public organization: GitOrganization

  @ManyToOne(type => GitRepository, gitRepository => gitRepository.tasks, { onDelete: 'SET NULL' })
  public repository: GitRepository

  @ManyToMany(type => Project, project => project.tasks)
  public projects: Project[]
}
