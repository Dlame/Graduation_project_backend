import { Injectable, HttpException, Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../entities/comment.entity';
import dayjs = require('dayjs');

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
  ) { }

  /**
   * 创建评论
   *
   * @param createInput createInput
   */
  async create(createInput): Promise<void> {
    createInput.create_time = dayjs().format('YYYY-MM-DD HH:mm:ss');
    await this.commentRepo.insert(createInput);
  }

  /**
   * 查询评论
   *
   * @param id 评论ID
   */
  async findOneById(id: number): Promise<Comment> {
    const comment = this.commentRepo.findOne({ id });
    if (!comment) {
      throw new HttpException('未找到该评论', 404);
    }
    return comment;
  }

  /**
   * 查询该书籍的所有收藏
   *
   * @param bookId 书籍ID
   */
  async findAll(bookId: number, page: number, size: number): Promise<any> {
    const count = await this.commentRepo.count({ where: { b_id: bookId } });
    const commentList = await this.commentRepo.find({
      where: { b_id: bookId },
      relations: ['user'],
      skip: (page - 1) * size,
      take: size,
    });

    return { count, commentList };
  }
}
