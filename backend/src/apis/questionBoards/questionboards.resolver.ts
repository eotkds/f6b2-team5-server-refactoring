import { BadRequestException, UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthAccessGuard } from 'src/common/auth/gql-auth.guard';
import { CurrentUser, ICurrentUser } from 'src/common/auth/gql-user.parm';
import { CreateQuestionBoardInput } from './dto/createQuestionBoard.input';
import { UpdateQuestionBoardInput } from './dto/updateQuestionBoard.input';
import { QuestionBoard } from './entities/questionBoard.entity';
import { QuestionBoardService } from './questionboards.service';

@Resolver()
export class QuestionBoardResolver {
  constructor(
    private readonly questionBoardService: QuestionBoardService, //
  ) {}

  //QuestionBoard 생성
  @UseGuards(GqlAuthAccessGuard)
  @Mutation(() => QuestionBoard)
  createQuestionBoard(
    @Args('createquestionBoardInput')
    createQuestionBoardInput: CreateQuestionBoardInput, //
    @CurrentUser('currentUser') currentUser: ICurrentUser,
  ) {
    return this.questionBoardService.create({
      createQuestionBoardInput,
      currentUser,
    });
  }

  //QuestionBoard 조회
  @Query(() => QuestionBoard)
  fetchQuestionBoard(@Args('questionboardId') questionBoardId: string) {
    return this.questionBoardService.findOne({ questionBoardId });
  }

  //QuestionBoards 전체조회 // 페이징네이션
  @Query(() => [QuestionBoard])
  fetchQuestionBoards(
    @Args({ name: 'page', type: () => Int, nullable: true })
    page: number,
  ) {
    return this.questionBoardService.findAll({ page });
  }

  //QuestionBoard 업데이트 // 작성자 확인은 추후 예정
  @Mutation(() => QuestionBoard)
  async updateQuestionBoard(
    @Args('questionBoardID') questionBoardId: string,
    @Args('updatequestionBoardInput')
    updateQuestionBoardInput: UpdateQuestionBoardInput,
  ) {
    return this.questionBoardService.update({
      questionBoardId,
      updateQuestionBoardInput,
    });
  }

  //QuestionBoard 게시물 삭제
  @Mutation(() => Boolean)
  deleteQuestionBoard(
    @Args('boardId') boardId: string, //
  ) {
    return this.questionBoardService.delete({ boardId });
  }

  //QuestionBoard 게시물 개수
  @Query(() => Int)
  fetchQuestionBoardsCount() {
    return this.questionBoardService.count();
  }
}
