import { Body, Controller, Post, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('code')
  async sendCode(
    @Body('id', ParseIntPipe) id: number,
    @Body('email') email: string,
  ) {
    const code = this.appService.sendEmailCode(id, email);
    return code;
  }
}
