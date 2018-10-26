import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class UserInvitation {
  /***** columns *****/
  @PrimaryGeneratedColumn()
  public id: number

  @Column({
    unique: true,
    nullable: false
  })
  public email: string

  @Column({
    unique: true,
    nullable: false
  })
  public hash: string

  @Column({
    default: true
  })
  public active: boolean
}
