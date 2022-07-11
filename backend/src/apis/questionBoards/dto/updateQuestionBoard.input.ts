import { InputType, PartialType } from '@nestjs/graphql';
import { CreateQuestionBoardInput } from './createQuestionBoard.input';

@InputType()
export class UpdateQuestionBoardInput extends PartialType(
  CreateQuestionBoardInput,
  InputType,
) {}
