import * as bcrypt from 'bcryptjs';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Job from './job.entity';

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({
    unique: true,
  })
  email: string;
  @Column()
  password: string;
  @Column({
    default: true,
    nullable: false,
  })
  status: boolean;
  @OneToMany(() => Job, (job) => job.user)
  jobs: Job[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hashSync(this.password, salt);
  }
}
