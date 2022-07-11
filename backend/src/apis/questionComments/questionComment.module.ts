import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionBoard } from '../questionBoards/entities/questionBoard.entity';
import { User } from '../users/entities/users.entity';
import { UserService } from '../users/user.service';
import { QuestionComment } from './entities/questionComment.entity';
import { QuestionCommentResolver } from './questionComment.resolver';
import { QuestionCommentService } from './questionComment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionComment, //
      User, //
      QuestionBoard, //
    ]),
  ],
  providers: [
    QuestionCommentResolver, //
    QuestionCommentService, //
    UserService, //
  ],
})
export class QuestionCommentModule {}
