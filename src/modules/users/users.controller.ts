import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  Inject,
  CACHE_MANAGER,
  HttpException,
  ParseIntPipe,
  Req,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  AlterEmailDto,
  AlterPasswordDto,
  AlterUserDto,
} from './dto/update-user.dto';
import { FindManyUserDto } from './dto/find-user.dto';
import { UtilsService } from 'src/utils/utils.service';
import { Public } from 'src/common/public.decorator';
import { UserId } from 'src/common/user-id.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly utilsService: UtilsService,
  ) {}

  // 获取验证码
  @Public()
  @Post('email-code')
  async sendEmailCode(@UserId() userId: number, @Body('email') email: string) {
    try {
      const user = await this.usersService.findOne({ id: userId });
      if (user?.nickname) {
        await this.utilsService.sendEmailCode(user.nickname, email);
        return true;
      } else {
        return new HttpException('用户不存在', 400);
      }
    } catch (error) {
      return new HttpException('服务器内部错误！', 500);
    }
  }

  // 注册
  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // 获取用户信息
  @Public()
  @Get(':id')
  getUser(@UserId() userId: number) {
    return this.usersService.findOne({ id: userId });
  }

  // 查找用户
  // @Public()
  @Get()
  getUsers(@Query() query: FindManyUserDto) {
    const { page, size, ...args } = query;
    const userVo = {
      skip: (page - 1) * size,
      take: size,
      where: args,
    };
    return this.usersService.findMany(userVo);
  }

  // 修改用户信息
  @Patch(':id')
  alterBasic(@UserId() userId: number, @Body() params: AlterUserDto) {
    return this.usersService.update(userId, params);
  }

  // 修改用户密码
  @Put(':id/password')
  alterPassword(@UserId() userId: number, @Body() password: string) {
    this.usersService.update(userId, { password });
  }

  // 邮箱验证码找回密码
  // @Get('password')
  // async findPassword(@Body() params: AlterPasswordDto) {
  //   try {
  //     const user = await this.usersService.findOne({ email: params.email });
  //     if (user?.nickname) {
  //       await this.utilsService.sendEmailCode(user.nickname, params.email);
  //       return true;
  //     } else {
  //       return new HttpException('用户不存在', 400);
  //     }
  //   } catch (error) {
  //     return new HttpException('服务器内部错误！', 500);
  //   }
  //   if (params.code == code) {
  //     return this.usersService.update(id, { password: params.newPassword });
  //   } else {
  //     return new HttpException('验证码不正确!', 400);
  //   }
  // }

  // 绑定邮箱
  @Put(':id/email')
  async alterEmail(
    @Param('id', ParseIntPipe) id: number,
    @Body() params: AlterEmailDto,
  ) {
    try {
      const { email, code } = params;
      const cacheCode = await this.cacheManager.get(`${id}:${email}:code`);
      if (code != cacheCode) return new HttpException('验证码不正确！', 400);
      const res = await this.usersService.update(id, { email });
      await this.cacheManager.del(`${id}:${email}:code`);
      return res;
    } catch (err) {
      return new HttpException('服务器内部错误！', 500);
    }
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
