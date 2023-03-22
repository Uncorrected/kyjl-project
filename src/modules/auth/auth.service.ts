import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne({ username });
    const Obj = await this.usersService.userPassword({ username });
    if (user && Obj.password === pass) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    console.log(user);
    const payload = { id: user.id };
    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }
}
