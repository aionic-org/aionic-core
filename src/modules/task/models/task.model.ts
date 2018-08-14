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

@Entity()
export class Task {
  /***** columns *****/
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public title: string

  @Column('text')
  public text: string

  @Column({
    default: false
  })
  public published: boolean

  @CreateDateColumn()
  public created: Timestamp

  @UpdateDateColumn()
  public updated: Timestamp

  /***** relations *****/
  @ManyToOne(type => User, user => user.articlesAuthor)
  public author: User

  @ManyToOne(type => User, user => user.articlesAuthor)
  public assignee: User
}
