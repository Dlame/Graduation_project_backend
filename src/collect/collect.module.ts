import { Module } from '@nestjs/common';
import { CollectService } from './collect.service';
import { CollectController } from './collect.controller';
import { Collect } from '../entities/collect.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { Books } from 'src/entities/books.entity';

@Module({
  imports: [
    // 向书籍收藏模块注册 passport，并配置默认策略为 jwt，因为覆盖了默认的策略，所以要在每个使用 @AuthGuard() 的模块导入 PassportModule
    PassportModule.register({ defaultStrategy: 'jwt', property: 'user' }),
    TypeOrmModule.forFeature([Collect, Books]),
  ],
  providers: [CollectService],
  controllers: [CollectController],
})
export class CollectModule { }
