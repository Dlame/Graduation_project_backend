import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersService) private readonly userService: UsersService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async createToken(payload: { account: string }): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validateUser(payload: { account: string }): Promise<User> {
    return await this.userService.findOneByAccount(payload.account);
  }
}
