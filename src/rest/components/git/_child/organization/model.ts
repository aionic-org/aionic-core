import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'

import { GitRepository } from '../repository/model'

@Entity()
export class GitOrganization {
  /***** columns *****/
  @PrimaryGeneratedColumn()
  public id: number

  @Column({
    unique: true
  })
  public name: string

  @Column({
    type: 'text'
  })
  public description: string

  @Column()
  public url: string

  @Column()
  public avatarUrl: string

  @Column()
  public reposUrl: string

  @Column()
  public htmlUrl: string

  @OneToMany(type => GitRepository, gitRepository => gitRepository.organization)
  public repositories: GitRepository[]
}
