import { Controller, Inject, Body, Post, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { Result } from '../common/result.interface';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(UsersService) private readonly usersService: UsersService,
    @Inject(AuthService) private readonly authService: AuthService,
  ) { }

  @Post('login')
  async login(@Body() body: { account?: string; password?: string; }): Promise<Result> {
    await this.usersService.login(body);
    const accessToken = await this.authService.createToken({
      account: body.account,
    });
    return { return_code: '01', return_msg: '登录成功', data: accessToken };
  }

  @Post('register')
  async register(@Body() user: User): Promise<Result> {
    await this.usersService.register(user);
    return { return_code: '01', return_msg: '注册成功' };
  }

  @Get()
  async find(@Query() query): Promise<Result> {
    const userinfo = await this.usersService.findOneByAccount(query.account);
    return { return_code: '01', return_msg: '登录成功', data: userinfo };
  }
}
