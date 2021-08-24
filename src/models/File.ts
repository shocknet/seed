import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Token } from './Token';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  originalname: string;

  @Column({
    nullable: false,
  })
  encoding: string;

  @Column({
    nullable: false,
  })
  mimetype: string;

  @Column({
    nullable: false,
  })
  size: number;

  @Column({
    nullable: false,
  })
  destination: string;

  @Column({
    nullable: false,
  })
  filename: string;

  @Column({
    nullable: false,
  })
  path: string;

  @Column({
    nullable: true,
  })
  hash: string;

  @Column({
    nullable: true,
  })
  magnet: string;

  @ManyToOne(type => Token, token => token.files)
  token: Token;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
