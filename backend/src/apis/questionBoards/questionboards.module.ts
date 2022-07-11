import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/users.entity';
import { QuestionBoard } from './entities/questionBoard.entity';
import { QuestionBoardResolver } from './questionboards.resolver';
import { QuestionBoardService } from './questionboards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuestionBoard, //
      User, //
    ]),
  ],
  providers: [
    QuestionBoardResolver, //
    QuestionBoardService, //
  ],
})
export class QuestionBoardModule {}
