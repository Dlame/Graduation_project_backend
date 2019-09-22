import { Injectable, Inject, HttpException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { CryptoUtil } from '../shared/utils/crypto.util';

@Injectable()
export class UsersService implements OnModuleInit {
  async onModuleInit() {
    if (await this.findOneByAccount('admin')) { return; }
    // 初始化系统管理员
    const admin = this.userRepo.create({
      account: 'admin',
      password: this.cryptoUtil.encryptPassword('admin!'),
      name: '张喆',
      department: '信息工程学院',
      class: '通信1151',
    });
    await this.userRepo.save(admin);
  }

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @Inject(CryptoUtil) private readonly cryptoUtil: CryptoUtil,
  ) { }

  /**
   * 用户注册
   *
   * @param user 用户信息
   */
  async register(user: User): Promise<void> {
    const existing = await this.findOneByAccount(user.account);
    if (existing) { throw new HttpException('账号已存在', 409); }
    user.password = this.cryptoUtil.encryptPassword(user.password);
    await this.userRepo.save(this.userRepo.create(user));
  }

  /**
   * 用户登录
   *
   * @param account 登录账号
   * @param password 登录密码
   * @param openid
   */
  async login(loginInput): Promise<void> {
    let user = new User();
    if ('password' in loginInput) {
      user = await this.findOneByAccount(loginInput.account);
      if (!user) {
        throw new HttpException('登录账号有误', 406);
      }
      if (!this.cryptoUtil.checkPassword(loginInput.password, user.password)) {
        throw new HttpException('登录密码有误', 406);
      }
    } else {
      user = await this.findOneByOpenid(loginInput.openid);
      if (!user) {
        throw new HttpException('登录失败', 406);
      }
    }
  }

  /**
   * 更新用户
   *
   * @param id 用户ID
   * @param updateInput updateInput
   */
  async update(id: number, updateInput: User) {
    const existing = await this.userRepo.findOne(id);
    if (!existing) { throw new HttpException(`更新失败，ID 为 '${id}' 的用户不存在`, 404); }
    if (updateInput.account) { existing.account = updateInput.account; }
    if (updateInput.password) { existing.password = this.cryptoUtil.encryptPassword(updateInput.password); }
    if (updateInput.name) { existing.name = updateInput.name; }
    await this.userRepo.save(existing);
  }

  /**
   * 通过登录账号查询用户
   *
   * @param account 登录账号
   */
  async findOneByAccount(account: string): Promise<User> {
    return await this.userRepo.findOne({ account });
  }

  /**
   * 通过openid查询用户
   *
   * @param openid 登录账号
   */
  async findOneByOpenid(openid: string): Promise<User> {
    return await this.userRepo.findOne({ openid });
  }

}
