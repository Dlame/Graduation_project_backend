import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Borrow } from './borrow.entity';
import { Collect } from './collect.entity';

@Entity()
export class Books {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ length: 255 })
  author: string;

  @Column({ length: 255 })
  isbn: string;

  @Column({ length: 255 })
  publisher: string;

  @Column('int')
  collect: number;

  @Column('int')
  available: number;

  @Column('text')
  intro: string;

  @Column({ length: 255 })
  callNumber: string;

  @Column({ length: 255 })
  image: string;

  @OneToMany(type => Borrow, borrow => borrow.books)
  borrows: Borrow[];

  @OneToMany(type => Collect, collect => collect.books)
  collects: Collect[];
}
