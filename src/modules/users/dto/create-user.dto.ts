import { PickType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { User } from '../entities/user.entity';

export class CreateUserDto extends PickType(User, [
  'username',
  'password',
  'nickname',
  'address',
]) {
  @IsOptional()
  nickname: string;

  @IsOptional()
  address: string;
}
