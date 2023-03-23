import { Injectable, HttpException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FindManyUserVo, OneUserVo } from './dto/find-user.dto';
import { UpdateUserVo } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.userRepository.findOneBy({
        username: createUserDto.username,
      });
      if (user) {
        throw new HttpException('用户已注册！', 400);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = await this.userRepository.save(
          createUserDto,
        );
        return result;
      }
    } catch (err) {
      throw new HttpException('服务器内部错误！', 500);
    }
  }

  async findMany(condition: FindManyUserVo) {
    try {
      const [users, total] = await this.userRepository.findAndCount(condition);
      return { users, total };
    } catch (err) {
      throw new HttpException('服务器内部错误！', 500);
    }
  }

  async findOne(params: OneUserVo) {
    try {
      const user = await this.userRepository.findOneBy(params);
      if (user.avatar) {
        const host = this.configService.get('APP_HOST');
        const port = this.configService.get('APP_PORT');
        const baseUrl = `${host}:${port}`;
        const prefix = this.configService.get('ASSETS_PREFIX');
        return {
          ...user,
          avatar: `${baseUrl}/${prefix}/${user.avatar}`,
        };
      }
      return user;
    } catch (err) {
      throw new HttpException('服务器内部错误！', 500);
    }
  }

  async userPassword(params: OneUserVo) {
    try {
      return this.userRepository.findOne({
        where: params,
        select: ['password'],
      });
    } catch (err) {
      throw new HttpException('服务器内部错误！', 500);
    }
  }

  async update(id: number, data: UpdateUserVo) {
    try {
      await this.userRepository.save({
        id,
        ...data,
      });
      return this.userRepository.findOneBy({
        id,
      });
    } catch (err) {
      console.log(err);
      throw new HttpException('服务器内部错误！', 500);
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const res = await this.userRepository.delete(id);
      return res.affected ? true : false;
    } catch (err) {
      throw new HttpException('服务器内部错误！', 500);
    }
  }
}
