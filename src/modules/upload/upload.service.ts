import * as fs from 'fs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { UsersService } from '../users/users.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async saveAvatarUrl(id: number, dirPath: string, newAvatar: string) {
    const { avatar, ...user } = await this.userService.findOne({ id });
    const lastIndexOne = avatar.lastIndexOf('/');
    const lastIndexTwo = avatar.lastIndexOf('/', lastIndexOne - 1);
    const filePath = dirPath + avatar.slice(lastIndexTwo); // 本地图片的路径
    // 头像存在,删除原头像
    if (avatar) {
      fs.access(filePath, (err) => {
        if (!err) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log('删除成功');
            }
          });
        } else {
          console.log('文件不存在');
        }
      });
    }
    // 保存新头像
    await this.userService.update(id, { avatar: newAvatar });
    return {
      ...user,
      avatar: `${avatar.slice(0, lastIndexTwo)}/${newAvatar}`,
    };
  }
}
