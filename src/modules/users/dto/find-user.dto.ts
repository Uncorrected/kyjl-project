import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsPositive, IsString, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../entities/user.entity';

export class FindManyUserDto extends PickType(User, [
  'address',
  'nickname',
] as const) {
  @IsPositive({ message: (args) => `${args.property}必须是正整数` })
  @Type(() => Number)
  page: number;

  @IsPositive({ message: (args) => `${args.property}必须是正整数` })
  @Type(() => Number)
  size: number;
}

export class FindOneUserDto extends PickType(User, [
  'username',
  'password',
  'email',
] as const) {
  @ValidateIf((o) => !o.email)
  username: string;

  @ValidateIf((o) => o.username)
  password: string;

  @ValidateIf((o) => !o.username)
  email: string;

  @ValidateIf((o) => o.email)
  @IsNotEmpty({ message: (args) => `${args.property}不能为空` })
  @IsString({ message: (args) => `${args.property}必须是字符串` })
  code: string;
}

export class OneUserVo {
  id?: number;

  username?: string;

  email?: string;
}

export class FindManyUserVo extends PartialType(User) {
  skip: number;

  take: number;
}
