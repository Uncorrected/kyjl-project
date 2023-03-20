import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { CacheModule, Module } from '@nestjs/common';
import { UtilsService } from './utils.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.qq.com',
          secure: true,
          auth: {
            user: '2227253724@qq.com',
            pass: 'tijsxayjmrsgecae',
          },
        },
        defaults: {
          from: '"nest-modules" <2227253724@qq.com>',
        },
        template: {
          dir: process.cwd() + '/templates/',
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    CacheModule.register(),
  ],
  providers: [UtilsService],
  exports: [UtilsService],
})
export class UtilsModule {}
