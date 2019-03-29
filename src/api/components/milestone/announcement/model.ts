import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp
} from 'typeorm'

import { User } from '@global/user/model'

@Entity()
export class Announcement {
  /***** columns *****/
  @PrimaryGeneratedColumn()
  public id: number

  @Column({
    default: null,
    type: 'text'
  })
  public description: string

  @CreateDateColumn()
  public created: Timestamp

  /***** relations *****/
  @ManyToOne(type => User, user => user.author)
  public author: User
}
