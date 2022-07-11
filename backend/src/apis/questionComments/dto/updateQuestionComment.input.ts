import { InputType, PartialType } from '@nestjs/graphql';
import { CreateQuestionCommentInput } from './createQuestionComment.input';

@InputType()
export class UpdateQuestionCommentInput extends PartialType(
  CreateQuestionCommentInput,
) {}
