import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm'

import { Task } from '../model'

@Entity()
export class TaskPriority {
  /***** columns *****/
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public title: string

  @Column()
  public value: number

  /***** relations *****/
  @OneToMany(type => Task, task => task.priority)
  public tasks: Array<Task>
}
