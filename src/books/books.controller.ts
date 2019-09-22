import { Controller, Get, Param, Post, Body, Put, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { Books } from '../entities/books.entity';
import { Result } from '../common/result.interface';
import { BooksDTO } from './dtos/books.dto';
import { KeywordDTO } from './dtos/keyword.dtos';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Get()
  async findAll(@Query() query: BooksDTO): Promise<any> {
    const data = await this.booksService.findAll(query);
    return { return_code: '01', return_msg: '查询成功', data };
    // return data;
  }

  @Post('keyword')
  async findByKeyword(@Body() body: KeywordDTO): Promise<Result> {
    const data = await this.booksService.findByKeyword(body);
    return { return_code: '01', return_msg: '查询成功', data };
  }

  @Get('id/:id')
  async findByid(@Param('id') id: number): Promise<Result> {
    const data = await this.booksService.findById(id);
    return { return_code: '01', return_msg: '查询成功', data };
  }

  @Post('create')
  async createBook(@Body() books: Books): Promise<Result> {
    await this.booksService.createBook(books);
    return { return_code: '01', return_msg: '创建成功' };
  }

  @Put('update')
  async updateBook(@Body() id: number, books: Books): Promise<Result> {
    await this.booksService.updateBook(id, books);
    return { return_code: '01', return_msg: '更新成功' };
  }
}
