import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  b_id: number;

  @Column({ length: 144 })
  comment: string;

  @Column({ type: 'datetime' })
  create_time: string;

   // 在 @ManyToOne 一侧，即在外键拥有者一侧，设置 onDelete，就可以使用外键的级联功能，这里设置级联删除，当删除 user 时，user 的所有 post 会被级联删除
   @ManyToOne(type => User, user => user.comments, {
    onDelete: 'CASCADE',
  })
  user: User;
}
