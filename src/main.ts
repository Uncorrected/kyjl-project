import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: ['error', 'warn', 'log'],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 数据类型转换
      enableDebugMessages: true, // 控制台打印警告消息
      whitelist: true, // 跳过未添加验证的属性
      forbidNonWhitelisted: true, // 不跳过属性，抛出错误
      forbidUnknownValues: true,
      stopAtFirstError: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
