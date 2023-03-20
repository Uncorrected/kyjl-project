import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('longtext')
  content: string;

  @Column({ default: false })
  hot: boolean;

  @UpdateDateColumn()
  updateAt: Date;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
