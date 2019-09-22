import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collect } from '../entities/collect.entity';
import { Repository } from 'typeorm';
import dayjs = require('dayjs');
import { Books } from 'src/entities/books.entity';

@Injectable()
export class CollectService {
  constructor(
    @InjectRepository(Collect)
    private readonly collectRepo: Repository<Collect>,
    @InjectRepository(Books)
    private readonly bookRepo: Repository<Books>,
  ) { }

  /**
   * 创建收藏
   *
   * @param createInput createInput
   */
  async create(createInput): Promise<void> {
    const count = await this.collectRepo.count({ where: { u_id: createInput.userId, iscollect: 1 } });
    if (count >= 10) {
      throw new HttpException('收藏已达上限', 400);
    }
    const book = await this.bookRepo.findOne({ where: { id: createInput.booksId } });
    if (JSON.stringify(book) === '{}') {
      throw new HttpException('未找到该书', 404);
    }
    createInput.books = book;
    createInput.create_time = dayjs().format('YYYY-MM-DD HH:mm:ss');
    await this.collectRepo.save(createInput);
  }

  /**
   * 更新收藏
   *
   * @param id 收藏ID
   * @param updateInput updateInput
   */
  async update(booksId: number, userId: number, updateInput: Collect): Promise<void> {
    const existing = await this.findOneBybooksId(booksId, userId);
    if (!existing) {
      throw new HttpException(`更新失败`, 404);
    }
    if ('iscollect' in updateInput) { existing.iscollect = updateInput.iscollect; }
    existing.update_time = dayjs().format('YYYY-MM-DD HH:mm:ss');
    await this.collectRepo.save(existing);
  }

  /**
   * 删除收藏
   *
   * @param id 收藏ID
   */
  async remove(id: number): Promise<void> {
    const existing = await this.findOneById(id);
    if (!existing) {
      throw new HttpException(`取消失败，该收藏不存在`, 404);
    }
    await this.collectRepo.remove(existing);
  }

  /**
   * 查询收藏
   *
   * @param id 收藏ID
   */
  async findOneById(id: number): Promise<Collect> {
    return await this.collectRepo.findOne(id);
  }

  /**
   * 查询收藏
   *
   * @param id 收藏ID
   */
  async findOneBybooksId(booksId: number, userId: number): Promise<Collect> {
    return await this.collectRepo.findOne({ where: { booksId, u_id: userId } });
  }

  /**
   * 查询用户的所有收藏
   *
   * @param userId 用户ID
   */
  async findAll(userId: number): Promise<any> {
    const count = await this.collectRepo.count({ where: { u_id: userId, iscollect: 1 } });
    const collectList = await this.collectRepo.find({
      where: { u_id: userId, iscollect: 1 },
      relations: ['books'],
    });
    return { count, collectList };
  }
}
