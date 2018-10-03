import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'

import { Task } from '../task.model'

@Entity()
export class TaskStatus {
  /***** columns *****/
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public title: string

  @Column()
  public order: number

  @Column({
    default: false
  })
  public active: boolean

  /***** relations *****/
  @OneToMany(type => Task, task => task.status)
  public tasks: Array<Task>
}
