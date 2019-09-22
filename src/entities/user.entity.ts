import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Collect } from './collect.entity';
import { Comment } from './comment.entity';
import { Borrow } from './borrow.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255, nullable: true })
  openid: string;

  @Column({ length: 255 })
  account: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 255 })
  department: string;

  @Column({ length: 255 })
  class: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, nullable: true })
  avatar: string;

  @Column({ type: 'datetime', nullable: true })
  updateTime: string;

  @OneToMany(type => Collect, collect => collect.user)
  collects: Collect[];

  @OneToMany(type => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(type => Borrow, borrow => borrow.user)
  borrows: Borrow[];
}
