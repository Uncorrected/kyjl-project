import {
  Injectable,
  HttpException,
  Inject,
  CACHE_MANAGER,
} from '@nestjs/common';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Cache } from 'cache-manager';
import { random } from './utils/random';

@Injectable()
export class AppService {
  constructor(
    private readonly mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async sendEmailCode(id: number, email: string) {
    try {
      const code = random(6);
      const date = new Date();
      const dateTime = `${date.getFullYear()}-${
        date.getMonth() + 1
      }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      const sendMailOptions: ISendMailOptions = {
        to: email,
        subject: '用户邮箱验证',
        template: 'index',
        context: {
          verification_code: code,
          user_firstname: '张三',
          dateTime,
          confirm_link: 'www.baidu.com',
        },
        // attachments: [
        //     {
        //         filename: 'validate.code.ejs', //文件名
        //         path: path.join(process.cwd(), './src/email/template/validate.code.ejs') //服务端的文件地址
        //     }
        // ]
      };
      await this.mailerService.sendMail(sendMailOptions);
      await this.cacheManager.set(`${id}:${email}:code`, code, 5 * 60 * 1000);
      return code;
    } catch (error) {
      return new HttpException('服务器内部错误！', 500);
    }
  }

  async validatorCode(key: string, code: string) {
    const cacheCode = await this.cacheManager.get(key);
    if (cacheCode == code) {
      await this.cacheManager.del(key);
      return true;
    } else {
      return false;
    }
  }
}
