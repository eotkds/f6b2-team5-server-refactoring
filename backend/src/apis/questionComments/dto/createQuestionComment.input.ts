import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateQuestionCommentInput {
  @Field(() => String)
  contents: string;

  @Field(() => String)
  questionBoard: string;

  @Field(() => String)
  user: string;
}
