import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { SharedModule } from './shared/shared.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/httpexception.filter';
import { AuthModule } from './auth/auth.module';
import { CollectModule } from './collect/collect.module';
import { CommentModule } from './comment/comment.module';
import { ParamsValidationPipe } from './pipe/paramsValidation.pipe';
import { BorrowModule } from './borrow/borrow.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123',
      database: 'weapp',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      timezone: '+0800',
      logging: true,
    }),
    BooksModule,
    UsersModule,
    SharedModule,
    AuthModule,
    CollectModule,
    CommentModule,
    BorrowModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ParamsValidationPipe,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}
