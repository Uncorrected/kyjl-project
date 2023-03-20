import { PartialType, PickType } from '@nestjs/mapped-types';
import { IsString, IsNotEmpty, ValidateIf } from 'class-validator';
import { User } from '../entities/user.entity';

// 修改基本信息
export class AlterUserDto extends PickType(User, [
  'nickname',
  'address',
] as const) {
  @ValidateIf((o) => !o.address) // 如果其他属性没有则启用校验，不能不传属性
  nickname: string;

  @ValidateIf((o) => !o.nickname)
  address: string;
}

// 修改邮箱
export class AlterEmailDto extends PickType(User, ['email'] as const) {
  @IsNotEmpty({ message: (args) => `${args.property}不能为空` })
  @IsString({ message: (args) => `${args.property}必须是字符串` })
  code: string;
}

export class AlterPasswordDto extends AlterEmailDto {
  @ValidateIf((o) => !o.email) // 只有当 email 不存在时才校验 oldPassword
  @IsNotEmpty({ message: (args) => `${args.property}不能为空` })
  @IsString({ message: (args) => `${args.property}必须是字符串` })
  oldPassword: string;

  @ValidateIf((o) => o.oldPassword || o.email) // 只有当 oldPassword 或 email 存在时才校验 newPassword
  @IsNotEmpty({ message: (args) => `${args.property}不能为空` })
  @IsString({ message: (args) => `${args.property}必须是字符串` })
  newPassword: string;

  @ValidateIf((o) => !o.oldPassword) // 只有当 oldPassword 不存在时才校验 email 和 code
  email: string;

  @ValidateIf((o) => o.oldPassword && o.email)
  code: string;
}

export class UpdateUserVo extends PartialType(User) {}
