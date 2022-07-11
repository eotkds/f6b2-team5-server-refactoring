import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/apis/users/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class QuestionBoard {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  questionBoardId: string;

  //카테고리는 DropDown방식으로 넘어올 예정
  @Column()
  @Field(() => String)
  questionCategory: string;

  @Column()
  @Field(() => String)
  title: string;

  @Column()
  @Field(() => String)
  contents: string;

  @CreateDateColumn()
  @Field(() => Date)
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
