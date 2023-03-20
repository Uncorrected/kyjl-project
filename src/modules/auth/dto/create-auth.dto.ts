import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: (args) => `${args.property}不能为空` })
  @IsString({ message: (args) => `${args.property}必须是字符串` })
  username: string;

  @IsNotEmpty({ message: (args) => `${args.property}不能为空` })
  @IsString({ message: (args) => `${args.property}必须是字符串` })
  password: string;
}
