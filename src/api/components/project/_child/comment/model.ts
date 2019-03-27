import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp
} from 'typeorm'

import { Project } from '@components/project/model'
import { User } from '@components/user/model'

@Entity()
export class ProjectComment {
  /***** columns *****/
  @PrimaryGeneratedColumn()
  public id: number

  @Column('text')
  public text: string

  @Column({
    default: true
  })
  public active: boolean

  @CreateDateColumn()
  public created: Timestamp

  /***** relations *****/
  @ManyToOne(type => User, user => user.projectComments, { onDelete: 'CASCADE' })
  public author: User

  @ManyToOne(type => Project, project => project.comments)
  public project: Project
}
