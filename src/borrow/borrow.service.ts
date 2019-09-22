import { Injectable, HttpException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { Borrow } from 'src/entities/borrow.entity';
import dayjs = require('dayjs');
import { Books } from 'src/entities/books.entity';

@Injectable()
export class BorrowService {
    constructor(
        @InjectRepository(Borrow)
        private readonly borrowRepo: Repository<Borrow>,
        @InjectRepository(Books)
        private readonly bookRepo: Repository<Books>) { }

    /**
     * 新建借书
     * @param createInput createInput
     */
    async create(createInput): Promise<void> {
        const book = await this.bookRepo.findOne({ id: createInput.booksId });
        if (JSON.stringify(book) === '{}') {
            throw new HttpException('未找到该书', 404);
        }
        book.available -= 1;
        if (book.available <= 0) {
            throw new HttpException('该书已被借完', 400);
        }
        await this.bookRepo.save(book);
        createInput.books = book;
        createInput.create_time = dayjs().format('YYYY-MM-DD HH:mm:ss');
        await this.borrowRepo.insert(createInput);
    }

    /**
     * 更新借阅
     *
     * @param id 借阅ID
     * @param updateInput updateInput
     */
    async update(id: number, userId: number, updateInput): Promise<void> {
        Logger.log('更新数据', JSON.stringify(updateInput));
        const existing = await this.findOneBybooksId(userId, id);
        if (!existing) {
            throw new HttpException(`更新失败`, 404);
        }
        if ('isBorrow' in updateInput) { existing.isBorrow = updateInput.isBorrow; }
        if ('expireTime' in updateInput) { existing.expireTime = updateInput.expireTime; }
        existing.update_time = dayjs().format('YYYY-MM-DD HH:mm:ss');
        await this.borrowRepo.save(existing);
    }

    /**
     * 删除借阅
     * @param booksId 书籍id
     * @param userId 用户id
     */
    async remove(booksId: number, userId: number): Promise<void> {
        const existing = await this.findOneBybooksId(userId, booksId);
        if (JSON.stringify(existing) === '{}') {
            throw new HttpException(`取消失败，该借阅不存在`, 404);
        }
        const book = await this.bookRepo.findOne({ id: booksId });
        if (JSON.stringify(book) === '{}') {
            throw new HttpException('未找到该书', 404);
        }
        book.available += 1;
        await this.bookRepo.save(book);
        await this.borrowRepo.remove(existing);
    }

    /**
     * 查询借书信息
     *
     * @param id 评论ID
     */
    async findOneById(id: number): Promise<Borrow> {
        return await this.borrowRepo.findOne({ id });
    }

    /**
     * 查询借书信息
     *
     * @param id 评论ID
     */
    async findOneBybooksId(userId: number, booksId: number): Promise<Borrow> {
        Logger.log('请求数据', booksId.toString());
        return await this.borrowRepo.findOne({ where: { booksId, userId } });
    }

    /**
     * 查询该用户的所有借书
     *
     * @param userId 书籍ID
     */
    async findCurrent(userId: number, query): Promise<any> {
        const qb = await getRepository(Borrow)
            .createQueryBuilder('borrow')
            .leftJoinAndSelect('borrow.books', 'books');
        qb.where('borrow.userId = :userId', { userId });
        qb.andWhere('borrow.isBorrow = :isBorrow', { isBorrow: 1 });

        if ('currentTime' in query) {
            qb.andWhere('borrow.expireTime > :currentTime', { currentTime: query.currentTime });

        }
        const count = await qb.getCount();
        const list = await qb.getMany();
        return { count, list };
    }

    /**
     * 查询该用户的逾期借书
     *
     * @param userId 书籍ID
     */
    async findOverdue(userId: number, query): Promise<any> {
        const qb = await getRepository(Borrow)
            .createQueryBuilder('borrow')
            .leftJoinAndSelect('borrow.books', 'books');
        qb.where('borrow.userId = :userId', { userId });
        qb.andWhere('borrow.isBorrow = :isBorrow', { isBorrow: 1 });

        if ('currentTime' in query) {
            qb.andWhere('borrow.expireTime < :currentTime', { currentTime: query.currentTime });

        }
        const count = await qb.getCount();
        const list = await qb.getMany();
        return { count, list };
    }
}
