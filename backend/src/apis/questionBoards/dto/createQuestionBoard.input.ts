import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateQuestionBoardInput {
  @Field(() => String)
  questionCategory: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  contents: string;
}
