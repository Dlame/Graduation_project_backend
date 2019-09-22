import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Books } from './books.entity';

@Entity('collect')
export class Collect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  booksId: number;

  @Column('int')
  iscollect: number;

  @Column({ type: 'datetime', nullable: true })
  update_time: string;

  @Column({ type: 'datetime' })
  create_time: string;

  // 在 @ManyToOne 一侧，即在外键拥有者一侧，设置 onDelete，就可以使用外键的级联功能，这里设置级联删除，当删除 user 时，user 的所有 post 会被级联删除
  @ManyToOne(type => User, user => user.collects, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(type => Books, books => books.collects, {
    onDelete: 'CASCADE',
  })
  books: Books;
}
