import { HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { Books } from '../entities/books.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Books) private readonly bookRepository: Repository<Books>,
  ) { }

  /**
   * 查询所有
   */
  async findAll(query): Promise<Books[]> {
    return await getRepository(Books)
      .createQueryBuilder('Demand')
      .skip((query.page - 1) * query.size)
      .take(query.size)
      .getMany();
  }

  /**
   * 按书名/作者/ISBN查找
   * @param body 关键词
   */
  async findByKeyword(body): Promise<Books[]> {
    Logger.log('请求数据', JSON.stringify(body));
    return this.bookRepository
      .createQueryBuilder('book')
      .where(
        'book.title LIKE :keyword OR book.author LIKE :keyword OR book.isbn LIKE :keyword',
        { keyword: '%' + body.keyword + '%' },
      )
      .skip((body.page - 1) * body.size)
      .take(body.size)
      .getMany();
  }

  /**
   * 根据id查找
   * @param id 书籍id
   */
  async findById(id: number): Promise<Books> {
    const book = await this.bookRepository.findOne({ id });
    if (JSON.stringify(book) === '{}') {
      throw new HttpException('未找到该书', 404);
    }
    return book;
  }

  /**
   * 创建书籍
   * @param books Books实体
   */
  async createBook(books: Books): Promise<void> {
    await this.bookRepository.insert(books);
  }

  /**
   *
   * @param id 书籍id
   * @param books Books实体
   */
  async updateBook(id: number, books: Books): Promise<void> {
    this.bookRepository
      .createQueryBuilder('book')
      .update()
      .set(books)
      .where('id = :id', { id })
      .execute();
  }
}
