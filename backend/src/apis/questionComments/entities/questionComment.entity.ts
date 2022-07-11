import { Field, ObjectType } from '@nestjs/graphql';
import { QuestionBoard } from 'src/apis/questionBoards/entities/questionBoard.entity';
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
export class QuestionComment {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => String)
  questionCommentId: string;

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

  @ManyToOne(() => QuestionBoard)
  @Field(() => QuestionBoard)
  questionBoard: QuestionBoard;

  @ManyToOne(() => User)
  @Field(() => User)
  user: User;
}
