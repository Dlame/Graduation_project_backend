import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Books } from './books.entity';

@Entity('borrow')
export class Borrow {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ comment: '书籍ID' })
    booksId: number;

    @Column({ comment: '是否收藏' })
    isBorrow: number;

    @Column({ type: 'date', comment: '借阅结束时间' })
    expireTime: string;

    @Column({ type: 'date', comment: '借阅开始时间' })
    borrowTime: string;

    @Column({ type: 'datetime', nullable: true })
    update_time: string;

    @Column({ type: 'datetime' })
    create_time: string;

    // 在 @ManyToOne 一侧，即在外键拥有者一侧，设置 onDelete，就可以使用外键的级联功能，这里设置级联删除，当删除 user 时，user 的所有 post 会被级联删除
    @ManyToOne(type => User, user => user.borrows, {
        onDelete: 'CASCADE',
    })
    user: User;

    @ManyToOne(type => Books, books => books.borrows, {
        onDelete: 'CASCADE',
    })
    books: Books;
}
