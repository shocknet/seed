import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { app } from '../server';

@Entity()
export class Blacklist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  hash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export const IsBlocked = async (hash: String) => {
  const BlacklistRepository = app.db.getRepository(Blacklist);

  const blocked = await BlacklistRepository.findOne({ where: { hash: hash } });

  if (!blocked) {
    return false;
  }

  return true;
};
