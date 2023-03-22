import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString, IsPositive, IsEmail } from 'class-validator';
import { Post } from 'src/modules/posts/entities/post.entity';

@Entity()
export class User {
  @IsNotEmpty({ message: (args) => `${args.property}不能为空` })
  @IsPositive({ message: (args) => `${args.property}必须是正整数` })
  @PrimaryGeneratedColumn()
  id?: number;

  @IsNotEmpty({ message: (args) => `${args.property}不能为空` })
  @IsString({ message: (args) => `${args.property}必须是字符串` })
  @Column({ unique: true, update: true })
  username?: string;

  @IsNotEmpty({ message: (args) => `${args.property}不能为空` })
  @IsString({ message: (args) => `${args.property}必须是字符串` })
  @Column({ select: false })
  password?: string;

  @IsNotEmpty({ message: (args) => `${args.property}不能为空` })
  @IsString({ message: (args) => `${args.property}必须是字符串` })
  @Column({ type: String, default: '默认昵称' })
  nickname: string;

  @IsNotEmpty({ message: (args) => `${args.property}不能为空` })
  @IsEmail({}, { message: (args) => `${args.property}必须是邮箱地址` })
  @Column({ unique: true, nullable: true })
  email?: string;

  @IsNotEmpty({ message: (args) => `${args.property}不能为空` })
  @IsString({ message: (args) => `${args.property}必须是字符串` })
  @Column({ nullable: true })
  school: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ default: false })
  state?: boolean;

  @Column({ default: false })
  isAdmin?: boolean;

  @OneToMany(() => Post, (post) => post.user)
  posts?: Post[];
}
