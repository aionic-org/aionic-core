import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { GitOrganization } from '@components/git/_child/organization/model'
import { Task } from '@components/task/model'

@Entity()
export class GitRepository {
  /***** columns *****/
  @PrimaryGeneratedColumn()
  public id: number

  @Column()
  public name: string

  @Column()
  public url: string

  @ManyToOne(type => GitOrganization, gitOrganization => gitOrganization.repositories, {
    onDelete: 'CASCADE'
  })
  public organization: GitOrganization

  @OneToMany(type => Task, task => task.repository)
  public tasks: Task[]
}
