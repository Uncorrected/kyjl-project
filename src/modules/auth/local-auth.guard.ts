import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { validateOrReject, validateSync } from 'class-validator';
import { LoginDto } from './dto/create-auth.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { username, password } = request.body;
    // 使用class-validator来验证参数
    const loginDto = new LoginDto();
    loginDto.username = username;
    loginDto.password = password;
    const validateResult = validateSync(loginDto);
    if (validateResult.length > 0) {
      const errorArray = [];
      validateResult.forEach((itme) => {
        const errorItem = Object.values(itme.constraints);
        errorArray.push(...errorItem);
      });
      throw new BadRequestException(errorArray);
    }
    return super.canActivate(context);
  }

  // handleRequest(err, user, info) {
  //   console.log(err, user, info);
  //   if (err || !user) {
  //     throw err || new UnauthorizedException('未捕获的异常');
  //   }
  //   return user;
  // }
}
