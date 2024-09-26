import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import User from './user.entity';

enum Status {
  FINISHED,
  NOTFINISH,
  CANCEL,
}

@Entity()
export default class Job {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  content: string;
  @CreateDateColumn({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP(6)',
    nullable: false,
  })
  createdDate: Date;
  @Column()
  deadline: Date;
  @Column({
    default: Status.NOTFINISH,
  })
  status: Status;
  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.jobs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
