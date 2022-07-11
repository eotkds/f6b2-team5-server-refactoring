import { Field, Int, ObjectType } from '@nestjs/graphql';

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  userId: string;

  @Column()
  @Field(() => String)
  userName: string;

  @Column()
  @Field(() => String)
  email: string;

  @Column()
  password: string;

  @Column()
  @Field(() => String)
  phone: string;

  @Column({ default: 'https://i.ibb.co/PYBhzR8/noprofile.jpg' })
  @Field(() => String)
  userImageURL: string;

  @Column({ default: 2 })
  @Field(() => Int)
  projectTicket: number;

  @Column({ default: false })
  @Field(() => Boolean)
  admin: boolean;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @UpdateDateColumn()
  @Field(() => Date)
  updateAt: Date;

  @DeleteDateColumn()
  @Field(() => Date)
  deletedAt: Date;
}
