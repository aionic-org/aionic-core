import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { Task } from '@milestone/task/model'

@Entity()
export class TaskStatus {
  /***** columns *****/
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public title: string

  @Column()
  public sort: number

  @Column({
    default: false
  })
  public active: boolean

  /***** relations *****/
  @OneToMany(type => Task, task => task.status)
  public tasks: Task[]
}
